import React, { useState, useEffect, useRef } from "react";
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
  IonLoading,
  IonText
} from "@ionic/react";
import { arrowBack, send } from "ionicons/icons";
import { useHistory, useParams } from "react-router-dom";
import styles from "./ChatContact.module.css";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { API_CONFIG } from '../../config';

interface Message {
  id: number;
  content: string;
  senderPhone: string;
  createdAt: Date;
  read: boolean;
}

interface Contact {
  contactid: number;
  name: string;
  phoneNumber?: string;
  img?: string;
  isBlocked?: boolean;
}

const ChatContact: React.FC = () => {
  const { id: contactid } = useParams<{ id: string }>();
  const history = useHistory();
  const { user } = useAuth();
  const [contact, setContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const contentRef = useRef<HTMLIonContentElement>(null);

  // Cargar contacto y mensajes
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        console.log('contactid', contactid);

        // Cargar datos del contacto
        const contactResponse = await axios.get(`${API_CONFIG.BASE_URL}/contacts/${contactid}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        });

        setContact(contactResponse.data);

        // Cargar historial de mensajes
        const messagesResponse = await axios.get(
          `${API_CONFIG.BASE_URL}/messages/conversation/${contactid}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`
            }
          }
        );

        setMessages(messagesResponse.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar la conversación');
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) loadData();
  }, [contactid, user?.token]);

  // Configurar WebSocket
  useEffect(() => {
    if (!contact?.phoneNumber || !user) return;

    const websocket = new WebSocket(`ws://192.168.240.27:8080/ws-chat?token=${user.token}`);

    websocket.onopen = () => {
      const subscriptionMessage = {
        type: "SUBSCRIBE",
        destination: `/topic/messages/${contactid}`
      };
      websocket.send(JSON.stringify(subscriptionMessage));
    };

    websocket.onmessage = (message) => {
      const newMessage = JSON.parse(message.data);
      setMessages(prev => [...prev, newMessage]);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [contact?.phoneNumber, user, contactid]);

  const handleSendMessage = async () => {

    console.log('Enter pressed', !newMessage.trim() || !contact?.phoneNumber || !user);
    // if (!newMessage.trim() || !contact?.phoneNumber || !user) return;

    try {
      // Enviar mensaje a través de WebSocket
      if (ws) {
        const messagePayload = {
          content: newMessage,
          receiverPhone: contact.phoneNumber
        };

        ws.send(JSON.stringify({
          type: "SEND",
          destination: `/app/send-message/${contactid}`,
          content: JSON.stringify(messagePayload)
        }));
      }

      // Limpiar input
      setNewMessage("");
    } catch (err) {
      setError('Error al enviar el mensaje');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleCancel = () => {
    history.goBack();
  };

  // Scroll automático al final
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollToBottom(300);
    }
  }, [messages]);

  if (loading) {
    return <IonLoading isOpen={true} message="Cargando conversación..." />;
  }

  if (error) {
    return (
      <IonPage>
        <IonContent className={styles.errorContainer}>
          <IonText color="danger">{error}</IonText>
          <IonButton onClick={handleCancel}>Volver</IonButton>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage className={styles.page}>
      <IonHeader className="ion-no-border">
        <IonToolbar className={styles.toolbar}>
          <IonButtons slot="start">
            <IonButton onClick={handleCancel} className={styles.backButton}>
              <IonIcon icon={arrowBack} slot="icon-only" />
            </IonButton>
          </IonButtons>

          <div className={styles.contactHeader}>
            <IonAvatar className={styles.contactAvatar}>
              <img
                src={contact?.img ? `data:image/jpeg;base64,${contact.img}` : 'https://i.gyazo.com/17f37bb6fd035c2055614479d36c7de2.jpg'}
                alt={contact?.name}
              />
            </IonAvatar>
            <h2 className={styles.contactName}>{contact?.name}</h2>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent ref={contentRef} className={styles.chatContent}>
        <div className={styles.messagesContainer}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.messageWrapper} ${message.senderPhone === user?.citizenid ? styles.sent : styles.received
                }`}
            >
              <div className={styles.messageBubble}>
                <p className={styles.messageText}>{message.content}</p>
                <span className={styles.messageTime}>
                  {new Date(message.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </IonContent>

      <IonFooter className={styles.chatFooter}>
        <div className={styles.inputContainer}>
          <IonInput
            placeholder="Escribe un mensaje..."
            value={newMessage}
            onIonChange={(e) => setNewMessage(e.detail.value || "")}
            onKeyPress={handleKeyPress}
            className={styles.messageInput}
          />
          <button
            className={styles.sendButton}
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <IonIcon icon={send} />
          </button>
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default ChatContact;