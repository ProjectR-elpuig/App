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
import { useHistory } from 'react-router-dom';
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

interface SettingsPageProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ isAuthenticated, setIsAuthenticated }) => {
  const history = useHistory();

  const handleBlockedContacts = () => {
    history.push(`/settings/blockedcontacts`);
  };

  const handleHelp = () => {
    history.push(`/settings/help`);
  };

  const handleExit = () => {
    setIsAuthenticated(false);
    history.push(`/`);
  };

  const handleChangePassword = () => {
    setIsAuthenticated(false);
    history.push(`/settings/changepassword`);
  };

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
          <IonItem button onClick={handleBlockedContacts} className={styles.settingsItem}>
            <IonIcon icon={watchOutline} slot="start" className={styles.itemIcon} />
            <p className={styles.itemLabel}>Blocked contact list</p>
            {/* <IonToggle slot="end" className={styles.toggle} /> */}
          </IonItem>

          {/* Help */}
          <IonItem button onClick={handleHelp} className={styles.settingsItem}>
            <IonIcon icon={helpCircleOutline} slot="start" className={styles.itemIcon} />
            <p className={styles.itemLabel}>Help system</p>
          </IonItem>

          {/* Privacy */}
          <IonItem button onClick={handleChangePassword} className={styles.settingsItem}>
            <IonIcon icon={lockClosedOutline} slot="start" className={styles.itemIcon} />
            <p className={styles.itemLabel}>Change password</p>
          </IonItem>

          {/* Logout Button */}
          <div className={styles.logoutContainer}>
            <IonButton onClick={handleExit} expand="block" color="danger" className={styles.logoutButton} fill="clear">
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