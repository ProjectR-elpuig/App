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
  {
    name: "Haylie Baptista",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Practica_App_movil-2gZWKvgrjeDHP5Y6nrY1RRXIK95Qqj.png",
  },
  {
    name: "Talan Bergson",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Practica_App_movil-2gZWKvgrjeDHP5Y6nrY1RRXIK95Qqj.png",
  },
  {
    name: "Emerson Geidt",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Practica_App_movil-2gZWKvgrjeDHP5Y6nrY1RRXIK95Qqj.png",
  },
  {
    name: "Lindsey Kenter",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Practica_App_movil-2gZWKvgrjeDHP5Y6nrY1RRXIK95Qqj.png",
  },
  {
    name: "Maria Schleifer",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Practica_App_movil-2gZWKvgrjeDHP5Y6nrY1RRXIK95Qqj.png",
  },
  {
    name: "Jakob Passaquindici Arcand",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Practica_App_movil-2gZWKvgrjeDHP5Y6nrY1RRXIK95Qqj.png",
  },
  {
    name: "Aspen Rhiel Madsen",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Practica_App_movil-2gZWKvgrjeDHP5Y6nrY1RRXIK95Qqj.png",
  },
  {
    name: "Marley Ekstrom Bothman",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Practica_App_movil-2gZWKvgrjeDHP5Y6nrY1RRXIK95Qqj.png",
  },
  {
    name: "Justin Workman",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Practica_App_movil-2gZWKvgrjeDHP5Y6nrY1RRXIK95Qqj.png",
  },
  {
    name: "Alfonso Korsgaard",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Practica_App_movil-2gZWKvgrjeDHP5Y6nrY1RRXIK95Qqj.png",
  },
  {
    name: "Tatiana Lipshutz",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Practica_App_movil-2gZWKvgrjeDHP5Y6nrY1RRXIK95Qqj.png",
  },
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
              <IonAvatar slot="start">
                <img src={contact.image || "/placeholder.svg"} alt={contact.name} />
              </IonAvatar>
              <IonLabel>
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

