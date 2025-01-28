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
  { name: "Haylie Baptista" },
  { name: "Talan Bergson" },
  { name: "Emerson Geidt" },
  { name: "Lindsey Kenter" },
  { name: "Maria Schleifer" },
  { name: "Jakob Passaquindici Arcand" },
  { name: "Aspen Rhiel Madsen" },
  { name: "Marley Ekstrom Bothman" },
  { name: "Justin Workman" },
  { name: "Alfonso Korsgaard" },
  { name: "Tatiana Lipshutz" },
]

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
                <img src={`https://randomuser.me/api/portraits/men/${i}.jpg`} alt={contact.name} />
              </IonAvatar>
              <IonLabel className="textUser">
                <h2>{contact.name}</h2>
                <p>Last message</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default ChatList

