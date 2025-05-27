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
} from "@ionic/react"
import { arrowBack, camera, happy, send } from "ionicons/icons"
import { useState, useRef, useEffect } from "react"
import styles from "./ChatContact.module.css"
import { useHistory, useParams } from "react-router-dom"
import SockJS from "sockjs-client"
import { Client } from "@stomp/stompjs"
import { useAuth } from "../../context/AuthContext";
import { API_CONFIG } from '../../config';
import axios from "axios"

interface Message {
  id: number
  text: string
  image?: string
  sent: boolean
  timestamp: Date
  sender?: string
  type?: string
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

  const [stompClient, setStompClient] = useState<Client | null>(null)
  const [chatId, setChatId] = useState<string | null>(null);


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
        sent: message.senderPhone == user.phoneNumber,
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

  const fetchChat = async () => {
    try {
      if (!user?.token) {
        throw new Error('No autenticado');
      }

      const response = await axios.get(
        `${API_CONFIG.BASE_URL}/chat/websocket/${contactid}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      // En tu código donde procesas la respuesta
      console.log('Respuesta de la API sobre LA ID DEL CHAT:', response.data);
      setChatId(response.data.id);
      if (!response.data) {
        throw new Error('Chat no encontrado');
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar el contacto');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const initializeChat = async () => {
      // Carga el contacto al iniciar el chat
      await fetchContact();
      // Recibe mensajes del chat
      await fetchMessages();
      // Carga la ID del chat
      await fetchChat();
    };
    initializeChat();
  }, [user?.token, contactid])

  useEffect(() => {
    if (!chatId) return; // No configurar WebSocket hasta tener chatId

    // Configurar conexión WebSocket
    const socket = new SockJS(`${API_CONFIG.BASE_URL_WS}`)
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
    })

    client.onConnect = () => {
      // Suscribirse al chat específico
      client.subscribe(`/topic/chat.${chatId}`, (message) => {
        const receivedMessage = JSON.parse(message.body)
        console.log("Mensaje recibido:", JSON.stringify(receivedMessage));
        // const msgOld = newMessage;
        if (receivedMessage.type === 'CHAT') handleReceivedMessage(receivedMessage);
        // setNewMessage(msgOld);
      })
      console.log("Conectado al WebSocket y suscrito al chat:", chatId)

      // Notificar al servidor sobre la conexión
      client.publish({
        destination: "/app/chat.addUser",
        body: JSON.stringify({
          sender: user?.citizenid,
          type: 'JOIN',
          chatId: chatId
        })
      })
    }

    client.onDisconnect = () => {
      console.log("Desconectado del WebSocket")
    }

    const sendLeaveMessage = async () => {
      if (client.connected) {
        await client.publish({
          destination: "/app/chat.disconnect",
          body: JSON.stringify({
            sender: user?.citizenid,
            type: 'LEAVE',
            chatId: chatId
          })
        });
        await new Promise(resolve => setTimeout(resolve, 500)); // Esperar 500ms
      }
    };

    const cleanup = async () => {
      await sendLeaveMessage();
      client.deactivate();
    };

    client.activate()
    setStompClient(client)

    return () => {
      // socket.close()
      console.log("Limpiando recursos del WebSocket")
      cleanup();
      // handleUnload();
      // window.removeEventListener('beforeunload', handleUnload);
      // client.unsubscribe(`/topic/chat.${chatId}`)
      // client.deactivate()
    }

  }, [chatId, user?.citizenid])

  const handleReceivedMessage = (message: any) => {
    const newMsg: Message = {
      id: messages.length + 1,
      text: message.content,
      sent: message.sender === user?.citizenid,
      timestamp: new Date(),
      sender: message.sender,
      type: message.type
    }

    setMessages(prev => [...prev, newMsg])
  }

  // Scrolea hacia abajo cuando se recibe un nuevo mensaje
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollToBottom(300)
    }
  }, [messages])

  // Envia mensajes al la API
  const sendMessageToApi = async (message: any) => {
    try {
      if (!user?.token) throw new Error('No autenticado');

      const payload = {
        receiverPhone: contact?.phoneNumber,
        content: message.content
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
    if (!newMessage.trim() || !stompClient) return

    // Crear mensaje tipo CHAT
    const chatMessage = {
      sender: user?.citizenid,
      content: newMessage,
      type: 'CHAT',
      chatId: chatId
    }

    // Enviar mensaje a través de WebSocket
    stompClient.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(chatMessage)
    })
    sendMessageToApi(chatMessage)

    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const handleCancel = async () => {
    console.log("Cancelando el chat y desconectando WebSocket", stompClient?.connected)
    if (stompClient?.connected) {
      await stompClient.publish({
        destination: "/app/chat.disconnect",
        body: JSON.stringify({
          sender: user?.citizenid,
          type: 'LEAVE',
          chatId: chatId
        })
      });
    }
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
              key={Math.random().toString(36).substring(2, 15)} // Genera un ID único para cada mensaje
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
