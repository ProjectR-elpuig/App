import type React from "react"

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonSearchbar,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonButtons,
  IonButton,
  IonIcon,
  IonPage,
} from "@ionic/react"
import { menuOutline, wifiOutline } from "ionicons/icons"
import { useState } from "react"
// import "./ContactsPage.css"
import styles from './contactpage.module.css';


const contacts = [
  { name: "Gustavo Calzoni", image: "/placeholder.svg?height=50&width=50" },
  { name: "Cheyenne Ekstrom Bothman", image: "/placeholder.svg?height=50&width=50" },
  { name: "Desirae Siphron", image: "/placeholder.svg?height=50&width=50" },
  { name: "Lydia Septimus", image: "/placeholder.svg?height=50&width=50" },
  { name: "Emery Dorwart", image: "/placeholder.svg?height=50&width=50" },
  { name: "Aspen Curtis", image: "/placeholder.svg?height=50&width=50" },
  { name: "Dulce Vetrovs", image: "/placeholder.svg?height=50&width=50" },
  { name: "Makenna Calzoni", image: "/placeholder.svg?height=50&width=50" },
  { name: "Makenna Levin", image: "/placeholder.svg?height=50&width=50" },
  { name: "Jaylon Herwitz", image: "/placeholder.svg?height=50&width=50" },
]

const ContactsPage: React.FC = () => {
  const [searchText, setSearchText] = useState("")

  return (
    <IonPage>
      {/* Status Bar */}

      {/* Header */}
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary" className="header-toolbar">
          <div className="logo-container">
            <h1>V-LINK</h1>
            <img src="/imgs/LogoTopBar.png" alt="V-Link Logo" className="topbarlogo" />
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {/* Search Bar */}
        <IonSearchbar
          value={searchText}
          onIonChange={(e) => setSearchText(e.detail.value!)}
          placeholder="text"
          className={styles.customsearchbar}
        />

        {/* Contact List */}
        <IonList>
          {contacts.map((contact, index) => (
            <IonItem key={index} lines="none" className={styles.contactitem}>
              <IonAvatar slot="start">
                <img src={contact.image || "/placeholder.svg"} alt={contact.name} />
              </IonAvatar>
              <IonLabel>{contact.name}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default ContactsPage

