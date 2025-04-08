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
  IonFabButton
} from "@ionic/react"
import {
  chatboxOutline
} from "ionicons/icons"
import { useState } from "react"
import { useHistory } from 'react-router-dom';
import styles from "./ChatList.module.css"

const contacts = [
  { id: 1, name: "Haylie Baptista", lastMsg: "¿Nos vemos mañana?" },
  { id: 2, name: "Talan Bergson", lastMsg: "¡Gracias por tu ayuda!" },
  { id: 3, name: "Emerson Geidt", lastMsg: "Te llamo más tarde." },
  { id: 4, name: "Lindsey Kenter", lastMsg: "No puedo ahora, luego hablamos." },
  { id: 5, name: "Maria Schleifer", lastMsg: "¿Cómo va todo?" },
  { id: 6, name: "Jakob Passaquindici Arcand", lastMsg: "Estoy en camino." },
  { id: 7, name: "Aspen Rhiel Madsen", lastMsg: "¿Qué planes para el fin de semana?" },
  { id: 8, name: "Marley Ekstrom Bothman", lastMsg: "Todo bien, ¿y tú?" },
  { id: 9, name: "Justin Workman", lastMsg: "Necesito que me confirmes, porfa." },
  { id: 10, name: "Alfonso Korsgaard", lastMsg: "Luego te cuento los detalles." },
  { id: 11, name: "Tatiana Lipshutz", lastMsg: "¿Quedamos para comer?" },
  { id: 12, name: "Carlos Mendoza", lastMsg: "¡Ya está listo!" },
  { id: 13, name: "Samantha Lee", lastMsg: "¿Me envías el archivo?" },
  { id: 14, name: "Miguel Torres", lastMsg: "Hoy no puedo, lo siento." },
  { id: 15, name: "Valeria Soto", lastMsg: "¡Qué emoción verte pronto!" },
  { id: 16, name: "Pedro Díaz", lastMsg: "Reunión a las 3 p.m., ¿te va bien?" },
  { id: 17, name: "Lucía Fernández", lastMsg: "Nos vemos en el parque." },
  { id: 18, name: "Mateo Gómez", lastMsg: "Avísame cuando llegues." },
  { id: 19, name: "Sofía Romero", lastMsg: "No te preocupes, todo bien." },
  { id: 20, name: "Javier Ramírez", lastMsg: "¿Dónde nos encontramos?" }
];

const ChatList: React.FC = () => {
  const history = useHistory();
  const [searchText, setSearchText] = useState("");

  const handleCreateChat = () => {
    history.push("/chats/addchat")
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleChat = () => { 
    history.push("/chats/chatcontact")
  }

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
        <div className={styles.searchContainer}>
          <IonSearchbar placeholder="Buscar..." className={styles.customSearchbar} animated={true} value={searchText} onIonInput={(e) => setSearchText(e.detail.value!)} />
        </div>

        <IonList>
          {filteredContacts.map((contact, i) => (
            <IonItem onClick={handleChat} key={i} className={styles.chatItem}>
              <IonAvatar slot="start" className={styles.avatar}>
                <img src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? "men" : "women"}/${i}.jpg`} alt={contact.name} />
              </IonAvatar>
              <IonLabel className={styles.textUser}>
                <h2>{contact.name}</h2>
                <p>{contact.lastMsg ? contact.lastMsg : "Last message"}</p>
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
