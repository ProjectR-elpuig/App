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
} from "@ionic/react"
import {
  peopleOutline,
  chatbubbleOutline,
  calendarOutline,
  timeOutline,
  settingsOutline,
  infiniteOutline,
  wifiOutline,
} from "ionicons/icons"
import "./ChatList.css"

const contacts = [
  { name: "Haylie Baptista", lastMsg: "¿Nos vemos mañana?" },
  { name: "Talan Bergson", lastMsg: "¡Gracias por tu ayuda!" },
  { name: "Emerson Geidt", lastMsg: "Te llamo más tarde." },
  { name: "Lindsey Kenter", lastMsg: "No puedo ahora, luego hablamos." },
  { name: "Maria Schleifer", lastMsg: "¿Cómo va todo?" },
  { name: "Jakob Passaquindici Arcand", lastMsg: "Estoy en camino." },
  { name: "Aspen Rhiel Madsen", lastMsg: "¿Qué planes para el fin de semana?" },
  { name: "Marley Ekstrom Bothman", lastMsg: "Todo bien, ¿y tú?" },
  { name: "Justin Workman", lastMsg: "Necesito que me confirmes, porfa." },
  { name: "Alfonso Korsgaard", lastMsg: "Luego te cuento los detalles." },
  { name: "Tatiana Lipshutz", lastMsg: "¿Quedamos para comer?" },
  { name: "Carlos Mendoza", lastMsg: "¡Ya está listo!" },
  { name: "Samantha Lee", lastMsg: "¿Me envías el archivo?" },
  { name: "Miguel Torres", lastMsg: "Hoy no puedo, lo siento." },
  { name: "Valeria Soto", lastMsg: "¡Qué emoción verte pronto!" },
  { name: "Pedro Díaz", lastMsg: "Reunión a las 3 p.m., ¿te va bien?" },
  { name: "Lucía Fernández", lastMsg: "Nos vemos en el parque." },
  { name: "Mateo Gómez", lastMsg: "Avísame cuando llegues." },
  { name: "Sofía Romero", lastMsg: "No te preocupes, todo bien." },
  { name: "Javier Ramírez", lastMsg: "¿Dónde nos encontramos?" }
];

const ChatList: React.FC = () => {
  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary" className="header-toolbar">
          <div className="logo-container">
            <h1>V-LINK</h1>
            <img src="/imgs/LogoTopBar.png" alt="V-Link Logo" className="topbarlogo" />
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="search-container">
          <IonSearchbar placeholder="Buscar..." className="custom-searchbar" animated={true} />
        </div>

        <IonList>
          {contacts.map((contact, i) => (
            <IonItem key={i} className="chat-item">
              <IonAvatar slot="start" className="avatar">
                <img src={`https://randomuser.me/api/portraits/${i % 2 == 0 ? "" : "wo"}men/${i}.jpg`} alt={contact.name} />
              </IonAvatar>
              <IonLabel className="textUser">
                <h2>{contact.name}</h2>
                <p>{contact.lastMsg ? contact.lastMsg : "Last message"}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default ChatList

