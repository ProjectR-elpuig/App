import type React from "react"
import { IonContent, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonPage } from "@ionic/react"
import { arrowBack, wifiOutline } from "ionicons/icons"
import { useParams, useHistory } from "react-router-dom"
import styles from "./SettingsHelpPage.module.css"

const SettingsHelpPage: React.FC = () => {
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
          <h2>Help V-LINK</h2>
        </div>

        {/* Help Content */}
        <div className={styles.helpContent}>
          <section className={styles.helpSection}>
            <h3>Contact:</h3>
            <ul>
              <li>Search contacts.</li>
              <li>Add/Edit/Del contact.</li>
              <li>Block contact.</li>
              <li>Change profile icon.</li>
            </ul>
          </section>

          <section className={styles.helpSection}>
            <h3>Chats:</h3>
            <ul>
              <li>Search chats.</li>
              <li>Create/Delete chat.</li>
              <li>Send message/photo/emojis.</li>
              <li>Change notification.</li>
              <li>Add chat to favorite.</li>
            </ul>
          </section>

          <section className={styles.helpSection}>
            <h3>Events:</h3>
            <ul>
              <li>View daily event/s.</li>
              <li>Create new event.</li>
              <li>Show all calendar events.</li>
            </ul>
          </section>

          <section className={styles.helpSection}>
            <h3>History:</h3>
            <ul>
              <li>View call history, from FiveM app.</li>
            </ul>
          </section>

          <section className={styles.helpSection}>
            <h3>Settings:</h3>
            <ul>
              <li>Change keyboard theme. (light/black)</li>
              <li>Show blocked contacts.</li>
              <li>Show this guide. (help guide)</li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className={styles.helpFooter}>
          <p>This is raw app example</p>
          <img src="/imgs/LogoTopBar.png" alt="V-Link Logo" className={styles.topbarLogo} />
        </div>
      </IonContent>
    </IonPage>
  )
}

export default SettingsHelpPage

