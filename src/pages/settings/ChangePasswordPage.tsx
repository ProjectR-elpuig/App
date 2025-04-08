import type React from "react"
import { IonContent, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonPage, IonInput } from "@ionic/react"
import { arrowBack, wifiOutline } from "ionicons/icons"
import { useState } from "react"
import { useParams, useHistory } from "react-router-dom"
import styles from "./ChangePasswordPage.module.css"

const ChangePasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const history = useHistory();

  const handleChangePassword = () => {
    if (newPassword === confirmPassword && newPassword.length > 0) {
      // Aquí iría la lógica para cambiar la contraseña
      console.log("Password changed successfully")
      // Redirigir a la página de configuración o mostrar un mensaje de éxito
      history.push("/settings");
    } else {
      // Mostrar un mensaje de error
      console.log("Passwords do not match or are empty")
    }
  }

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
          <h2>Change Password</h2>
        </div>

        {/* Password Form */}
        <div className={styles.formContainer}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>New Password</label>
            <IonInput
              type="password"
              placeholder="password"
              value={newPassword}
              onIonChange={(e) => setNewPassword(e.detail.value || "")}
              className={styles.passwordInput}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Repeat New Password</label>
            <IonInput
              type="password"
              placeholder="password"
              value={confirmPassword}
              onIonChange={(e) => setConfirmPassword(e.detail.value || "")}
              className={styles.passwordInput}
            />
          </div>

          <button className={styles.changePasswordButton} onClick={handleChangePassword}>
            Change password
          </button>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default ChangePasswordPage

