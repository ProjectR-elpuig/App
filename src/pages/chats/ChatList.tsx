import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonSearchbar,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonFooter,
  IonFab,
  IonFabButton,
  IonLoading
} from "@ionic/react"
import {
  chatboxOutline
} from "ionicons/icons"
import { useState, useEffect } from "react"
import { useIonViewWillEnter } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import styles from "./ChatList.module.css"
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_CONFIG } from '../../config';
import { Client } from '@stomp/stompjs';
import SockJS from "sockjs-client";

interface Contact {
  contactid: number;
  name: string;
  phoneNumber?: string;
  img?: string;
  lastMsg?: string;
  lastMsgDate?: string;
}

const ChatList: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const history = useHistory();

  const [stompClient, setStompClient] = useState<Client | null>(null);

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const formatMessageDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) {
      return "Just now";
    }

    if (diffInMinutes < 60) {
      return `About ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }

    if (diffInHours < 24) {
      return `About ${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    if (diffInDays === 1) {
      return 'Yesterday';
    }

    if (diffInDays < 7) {
      return `About ${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }

    if (diffInDays < 28) {
      const weeks = Math.floor(diffInDays / 7);
      return weeks === 1 ? 'About 1 week ago' : `About ${weeks} weeks ago`;
    }

    const months = Math.floor(diffInDays / 30);
    return months === 1 ? 'About 1 month ago' : `About ${months} months ago`;
  };


  useEffect(() => {
    if (contacts.length <= 0) return;
    const socket = new SockJS(`${API_CONFIG.BASE_URL_WS}`)
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
    })

    client.onConnect = () => {
      // Suscribirse al chat específico
      client.subscribe(`/topic/user.${user?.phoneNumber}`, (message) => {
        const receivedMessage = JSON.parse(message.body)
        // console.log(`Mensaje recibido en user.${user?.phoneNumber}:`, JSON.stringify(receivedMessage));

        const { content, receiverPhoneNumber } = receivedMessage;

        setContacts((prevContacts) => {
          const index = prevContacts.findIndex(c => c.phoneNumber === receiverPhoneNumber);
          if (index === -1) {
            // Si no se encuentra el contacto, recargar la lista
            fetchContacts(true);
            return prevContacts;
          }

          // Clonar contactos para evitar mutación directa
          const updatedContacts = [...prevContacts];
          const contact = updatedContacts[index];

          updatedContacts[index] = {
            ...contact,
            lastMsg: content,
            lastMsgDate: new Date().toISOString()
          };

          // Reordenar por fecha
          updatedContacts.sort((a, b) => {
            const dateA = a.lastMsgDate ? new Date(a.lastMsgDate).getTime() : 0;
            const dateB = b.lastMsgDate ? new Date(b.lastMsgDate).getTime() : 0;
            return dateB - dateA;
          });

          return updatedContacts;
        });

      })
      // console.log("Conectado al WebSocket y suscrito a user.", user?.phoneNumber)
    }

    client.onDisconnect = () => {
      // console.log("Desconectado del WebSocket de user.", user?.phoneNumber)
    }

    const cleanup = async () => {
      client.deactivate();
    };

    client.activate()
    setStompClient(client)

    return () => {
      // socket.close()
      // console.log("Limpiando recursos del WebSocket de user.", user?.phoneNumber)
      cleanup();
      // handleUnload();
      // window.removeEventListener('beforeunload', handleUnload);
      // client.unsubscribe(`/topic/chat.${chatId}`)
      // client.deactivate()
    }

  }, [contacts, user?.citizenid])

  // Función para obtener los contactos
  const fetchContacts = async (background: boolean = false) => {
    try {
      if (!background) {
        setLoading(true);
      }
      setError(null);

      if (!user?.token) {
        setError('Not authenticated');
        return;
      }

      const response = await axios.get(
        `${API_CONFIG.BASE_URL}/contacts/chats`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      const formattedContacts = response.data.map((contact: any) => ({
        contactid: contact.contactid,
        name: contact.name,
        phoneNumber: contact.phoneNumber,
        img: contact.img,
        lastMsg: contact.lastMessage,
        lastMsgDate: contact.lastMessageDate
      }));

      formattedContacts.sort((a: Contact, b: Contact) => {
        const dateA = a.lastMsgDate ? new Date(a.lastMsgDate).getTime() : 0;
        const dateB = b.lastMsgDate ? new Date(b.lastMsgDate).getTime() : 0;
        return dateB - dateA; // Orden descendente
      });

      setContacts(formattedContacts);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching contacts');
    } finally {
      setLoading(false);
    }
  };

  // Se ejecuta cada vez que la página se muestra
  useIonViewWillEnter(() => {
    fetchContacts();
  });

  const handleCreateChat = () => {
    history.push("/chats/contactlists");
  };

  const handleChat = (id: number) => {
    history.push(`/chats/chat/${id}`)
  }

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary" className={styles.headerToolbar}>
          <div className={styles.logoContainer}>
            <h1>V-LINK</h1>
            <img src="/imgs/LogoTopBar.png" alt="V-Link Logo" className={styles.topbarLogo} />
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonLoading isOpen={loading} message="Loading contacts..." />

        {error && (
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>{error}</p>
          </div>
        )}

        <div className={styles.searchContainer}>
          <IonSearchbar placeholder="Search..." className={styles.customSearchbar} animated={true} value={searchText} onIonInput={(e) => setSearchText(e.detail.value!)} />
        </div>

        <IonList>
          {filteredContacts.map((contact, i) => (
            <IonItem onClick={() => handleChat(contact.contactid)} key={contact.contactid} className={styles.chatItem}>
              <IonAvatar slot="start" className={styles.avatar}>
                <img
                  src={`data:image/jpeg;base64,${contact.img}`}
                  alt={contact.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://i.gyazo.com/17f37bb6fd035c2055614479d36c7de2.jpg';
                  }}
                />
              </IonAvatar>
              <IonLabel className={styles.textUser}>
                <div className={styles.messageContainer}>
                  <div className={styles.messageInfo}>
                    <h2>{contact.name}</h2>
                    <p className={styles.lastMessage}>
                      {contact.lastMsg ? truncateText(contact.lastMsg) : "No messages yet"}
                    </p>
                  </div>
                  {contact.lastMsgDate && (
                    <p className={styles.timestamp}>
                      {formatMessageDate(contact.lastMsgDate)}
                    </p>
                  )}
                </div>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>

        {/* Floating Action Button */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={handleCreateChat} className={styles.fabButton}>
            <IonIcon icon={chatboxOutline} className={styles.fabIcon} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  )
}

export default ChatList;
