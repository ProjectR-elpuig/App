import type React from "react"
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonButtons,
  IonButton,
  IonIcon,
  IonPage,
} from "@ionic/react"
import { arrowBack, wifiOutline } from "ionicons/icons"
import { useParams, useHistory } from "react-router-dom";
import styles from "./BlockedContactsPage.module.css"

const blockedContacts = [
  { id: 1, name: "Haylie Baptista" },
  { id: 2, name: "Talan Bergson" },
  { id: 3, name: "Emerson Geidt" }
]

const BlockedContactsPage: React.FC = () => {
  const history = useHistory();

  const onBack = (): void => {
    history.push("/settings");
  }


  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary" className={styles.headerToolbar}>
          <IonButtons slot="start">
            <IonButton onClick={onBack} className={styles.iconButton}>
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <div className={styles.logoContainer}>
            <h1>V-LINK</h1>
            <img src="/imgs/LogoTopBar.png" alt="V-Link Logo" className={styles.topbarLogo} />
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {/* Page Title */}
        <div className={styles.pageTitle}>
          <h2>Blocked contacts</h2>
        </div>

        {/* Contact List */}
        <IonList className={styles.contactList}>
          {blockedContacts.map((contact, index) => (
            <IonItem key={index} lines="none" className={styles.contactItem}>
              <IonAvatar slot="start">
                <img src={`https://randomuser.me/api/portraits/${index - 1 % 2 == 0 ? "" : "wo"}men/${index}.jpg`} alt={contact.name} />
              </IonAvatar>
              <IonLabel className={styles.textUser}>
                <h2>{contact.name}</h2>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default BlockedContactsPage

