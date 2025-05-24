import type React from "react"
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonPage,
  IonInput,
  IonFooter,
  IonAvatar,
} from "@ionic/react"
import { arrowBack, wifiOutline, camera, happy, send } from "ionicons/icons"
import { useState, useRef, useEffect } from "react"
import styles from "./ChatContact.module.css"
import { useHistory, useParams } from "react-router-dom"
import axios from 'axios';
import { useAuth } from "../../context/AuthContext";
import { API_CONFIG } from '../../config';
import { useWebSocket } from '../../hooks/useWebSocket';

interface Message {
  id: number
  text: string
  image?: string
  sent: boolean
  timestamp: Date
}

interface Contact {
  contactid: number;
  name: string;
  phoneNumber: string;
  img?: string;
  isBlocked?: boolean;
  isChatting?: boolean;
}

const ChatContact: React.FC = () => {
  const { id: contactid } = useParams<{ id: string }>();
  const [newMessage, setNewMessage] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const history = useHistory()
  const contentRef = useRef<HTMLIonContentElement>(null)

  const { user } = useAuth();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContact = async () => {
    try {
      if (!user?.token) {
        throw new Error('No autenticado');
      }

      const response = await axios.get(
        `${API_CONFIG.BASE_URL}/contacts/${contactid}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      // En tu código donde procesas la respuesta
      console.log('Respuesta de la API:', response.data);

      // Formatea el objeto individual (no uses map)
      const formattedContact = {
        contactid: response.data.contactid,
        name: response.data.name,
        phoneNumber: response.data.contacto?.phoneNumber ?? 'Número no disponible',
        img: response.data.contacto?.img
          ? `${response.data.contacto.img}`
          : '/imgs/default-avatar.jpg',
        isBlocked: response.data.isBlocked // Añadir esta línea
      };

      if (!response.data) {
        throw new Error('Contacto no encontrado');
      }

      console.log("Contacto formateado:", formattedContact);
      setContact(formattedContact);
    } catch (err: any) {
      setError(err.message || 'Error al cargar el contacto');
    } finally {
      setLoading(false);
    }
  };

  const { connect } = useWebSocket((message: any) => {
    const newMessage = {
      id: message.id,
      text: message.content,
      sent: message.senderPhone === user?.phoneNumber, // ✅ Compara con el remitente
      timestamp: new Date(message.createdAt)
    };
    setMessages(prev => [...prev, newMessage]); // ✅ Actualiza el estado
  });


  useEffect(() => {
    const client = connect();
    return () => {
      if (client) client.deactivate();
    }
  }, [user?.phoneNumber, contact?.phoneNumber]);


  const fetchMessages = async () => {
    try {
      if (!user?.token) {
        throw new Error('No autenticado');
      }

      const response = await axios.get(
        `${API_CONFIG.BASE_URL}/messages/conversation/${contactid}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );


      // En tu código donde procesas la respuesta
      console.log('Respuesta de la API Mensajes:', contact?.phoneNumber, response.data);

      // Aqui se deberia de meter los mensajes en el chat
      const formattedMessages = response.data.map((message: any) => ({
        id: message.id,
        text: message.content,
        sent: message.receiverPhone == contact?.phoneNumber,
        timestamp: new Date(message.createdAt),
      }));

      setMessages(formattedMessages);
      console.log("Mensajes formateados:", JSON.stringify(messages));

    } catch (err: any) {
      setError(err.message || 'Error al cargar el contacto');
    } finally {
      setLoading(false);
    }
  };

  // Intervalo para actualizar los mensajes cada 2 segundos (MALA PRÁCTICA)
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     if (contact?.phoneNumber === undefined) fetchContact();
  //     fetchMessages();
  //   }, 2000);
  //   return () => clearInterval(intervalId);
  // }, []);

  // Scrolea hacia abajo cuando se recibe un nuevo mensaje
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollToBottom(300)
    }
  }, [messages])

  useEffect(() => {
    // Carga el contacto al iniciar el chat
    fetchContact();
    // Recibe mensajes del chat
    fetchMessages();
  }, [contactid, user?.token, contact?.phoneNumber]);

  // Envia mensajes al la API
  const sendMessageToApi = async (message: Message) => {
    try {
      if (!user?.token) throw new Error('No autenticado');

      const payload = {
        receiverPhone: contact?.phoneNumber,
        content: message.text
      };

      const response = await axios.post(`${API_CONFIG.BASE_URL}/messages/send/${contactid}`, payload, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json"
        }
      });

      console.log("Mensaje enviado a la API:", JSON.stringify(payload));
      console.log("respuesta de la API del mensaje:", JSON.stringify(response.data));


    } catch (err: any) {
      setError(err.response?.data || 'Error al enviar el mensaje');
    }
  }

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const newMsg: Message = {
      id: messages.length + 1,
      text: newMessage,
      sent: true,
      timestamp: new Date(),
    }

    sendMessageToApi(newMsg);
    setNewMessage("");
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const handleCancel = () => {
    history.push("/chats");
  }

  return (
    <IonPage className={styles.page}>

      {/* Header */}
      <IonHeader className="ion-no-border">
        <IonToolbar className={styles.toolbar}>
          <IonButtons slot="start">
            <IonButton onClick={handleCancel} className={styles.backButton}>
              <IonIcon icon={arrowBack} slot="icon-only" />
            </IonButton>
          </IonButtons>
          <div className={styles.logoContainer}>
            <h1>V-LINK {contact?.name}</h1>
            <img src="./imgs/LogoTopBar.png" alt="" />
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent ref={contentRef} className={styles.chatContent}>
        <div className={styles.messagesContainer}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.messageWrapper} ${message.sent ? styles.sent : styles.received}`}
            >
              <div className={styles.messageBubble}>
                {message.text && <p className={styles.messageText}>{message.text}</p>}
                {message.image && (
                  <div className={styles.imageContainer}>
                    <img
                      src={"imgs/LogoTopBar.png"}
                      alt="Message attachment"
                      className={styles.messageImage}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </IonContent>

      <IonFooter className={styles.chatFooter}>
        <div className={styles.inputContainer}>
          <button className={styles.cameraButton}>
            <IonIcon icon={camera} />
          </button>
          <IonInput
            placeholder="message"
            value={newMessage}
            onIonChange={(e) => setNewMessage(e.detail.value || "")}
            onKeyPress={handleKeyPress}
            className={styles.messageInput}
          />
          <button className={styles.emojiButton}>
            <IonIcon icon={happy} />
          </button>
          <button className={styles.sendButton} onClick={handleSendMessage}>
            <IonIcon icon={send} />
          </button>
        </div>
      </IonFooter>
    </IonPage>
  )
}

export default ChatContact
