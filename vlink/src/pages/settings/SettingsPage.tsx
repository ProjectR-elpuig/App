import type React from "react"
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonToggle,
  IonIcon,
  IonButton,
} from "@ionic/react"
import {
  notificationsOutline,
  moonOutline,
  languageOutline,
  lockClosedOutline,
  colorPaletteOutline,
  helpCircleOutline,
  informationCircleOutline,
  logOutOutline,
  watchOutline
} from "ionicons/icons"
import styles from "./SettingsPage.module.css"

const SettingsPage: React.FC = () => {
  return (
    <IonPage className={styles.page}>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary" className={styles.headerToolbar}>
          <div className={styles.logoContainer}>
            <h1>V-LINK</h1>
            <img src="/imgs/LogoTopBar.png" alt="V-Link Logo" className={styles.topbarLogo} />
          </div>
        </IonToolbar>
      </IonHeader>

      <div className={styles.separator}></div>

      <div className={styles.titleContainer}>
        <h2 className={styles.title}>Settings</h2>
      </div>

      <IonContent className={styles.content}>
        <IonList lines="none" className={styles.settingsList}>
          {/* Notifications */}
          <IonItem className={styles.settingsItem}>
            <IonIcon icon={moonOutline} slot="start" className={styles.itemIcon} />
            <p className={styles.itemLabel}>Change keyboard theme</p>
            <IonToggle slot="end" className={styles.toggle} />
          </IonItem>

          {/* Dark Mode */}
          <IonItem button className={styles.settingsItem}>
            <IonIcon icon={watchOutline} slot="start" className={styles.itemIcon} />
            <p className={styles.itemLabel}>Blocked contact list</p>
            {/* <IonToggle slot="end" className={styles.toggle} /> */}
          </IonItem>

          {/* Help */}
          <IonItem button className={styles.settingsItem}>
            <IonIcon icon={helpCircleOutline} slot="start" className={styles.itemIcon} />
            <p className={styles.itemLabel}>Help system</p>
          </IonItem>

          {/* Privacy */}
          <IonItem button className={styles.settingsItem}>
            <IonIcon icon={lockClosedOutline} slot="start" className={styles.itemIcon} />
            <p className={styles.itemLabel}>Change password</p>
          </IonItem>


          {/* Theme */}
          {/* <IonItem button className={styles.settingsItem}>
            <IonIcon icon={colorPaletteOutline} slot="start" className={styles.itemIcon} />
            <IonLabel>Theme</IonLabel>
            <div className={styles.valueLabel}>Default</div>
          </IonItem> */}


          {/* About */}
          {/* <IonItem button className={styles.settingsItem}>
            <IonIcon icon={informationCircleOutline} slot="start" className={styles.itemIcon} />
            <IonLabel>About</IonLabel>
          </IonItem> */}

          {/* Logout Button */}
          <div className={styles.logoutContainer}>
            <IonButton expand="block" color="danger" className={styles.logoutButton} fill="clear">
              <IonIcon icon={logOutOutline} slot="start" />
              Logout
            </IonButton>
          </div>
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default SettingsPage;