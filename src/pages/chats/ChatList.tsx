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

  // Función para obtener los contactos
  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.token) {
        setError('No autenticado');
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

      setContacts(formattedContacts);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al obtener contactos');
    } finally {
      setLoading(false);
    }
  };

  // Se ejecuta al montar y cuando cambia el token
  useEffect(() => {
    // Configurar cliente WebSocket
    const socket = new SockJS(`${API_CONFIG.BASE_URL_WS}`);
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${user?.token}`
      },
      onConnect: () => {
        client.subscribe('/topic/newContact', () => {
          fetchContacts(); // Actualiza la lista cuando llega un nuevo contacto
        });
      },
      reconnectDelay: 5000,
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate(); // Limpiar al desmontar
    };
  }, [user?.token]);

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
        <IonLoading isOpen={loading} message="Cargando contactos..." />

        {error && (
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>{error}</p>
          </div>
        )}

        <div className={styles.searchContainer}>
          <IonSearchbar placeholder="Buscar..." className={styles.customSearchbar} animated={true} value={searchText} onIonInput={(e) => setSearchText(e.detail.value!)} />
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
                <h2>{contact.name}</h2>
                <p>{contact.lastMsg || "No messages yet"}</p>
                {contact.lastMsgDate && (
                  <p className={styles.timestamp}>
                    {new Date(contact.lastMsgDate).toLocaleTimeString()}
                  </p>
                )}
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
