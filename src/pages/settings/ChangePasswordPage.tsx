import type React from "react"
import { IonContent, IonHeader, IonToolbar, IonText, IonButtons, IonButton, IonIcon, IonPage, IonInput } from "@ionic/react"
import { arrowBack } from "ionicons/icons"
import { useState } from "react"
import { useHistory } from "react-router-dom"
import styles from "./ChangePasswordPage.module.css"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"
import { API_CONFIG } from '../../config'

const ChangePasswordPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [currentPassword, setCurrentPassword] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const history = useHistory()
  const { user } = useAuth()

  const handleChangePassword = async () => {
    if (!currentPassword) {
      setError("Please enter your current password")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("The new passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      setError("The password must be at least 6 characters long")
      return
    }

    setIsLoading(true)

    try {
      const response = await axios.put(
        `${API_CONFIG.BASE_URL}/profile/password`,
        {
          currentPassword,
          newPassword,
          confirmPassword
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json"
          }
        }
      )

      if (response.status === 200) {
        history.push("/settings")
      }
    } catch (error: any) {
      console.error("Error changing password:", error)

      let errorMessage = "Error changing password"
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = error.response.data || "Invalid data"
            break
          case 401:
            errorMessage = "Unauthorized - Invalid token"
            break
          case 404:
            errorMessage = "Endpoint not found"
            break
          default:
            errorMessage = `Server error (${error.response.status})`
        }
      } else if (error.request) {
        errorMessage = "No response received from server"
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const onBack = (): void => {
    history.push("/settings")
  }

  return (
    <IonPage className={styles.page}>
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

      <div className={styles.titleContainer}>
        <h2 className={styles.title}>Change Password</h2>
      </div>

      <IonContent className={styles.content}>
        <div className={styles.formContainer}>
          <div className={styles.inputGroup}>
            <p className={styles.inputLabel}>Current Password</p>
            <IonInput
              type="password"
              placeholder="Enter your current password"
              value={currentPassword}
              onIonChange={(e) => setCurrentPassword(e.detail.value || "")}
              className={styles.passwordInput}
            />
          </div>

          <div className={styles.inputGroup}>
            <p className={styles.inputLabel}>New Password</p>
            <IonInput
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onIonChange={(e) => setNewPassword(e.detail.value || "")}
              className={styles.passwordInput}
            />
          </div>

          <div className={styles.inputGroup}>
            <p className={styles.inputLabel}>Confirm New Password</p>
            <IonInput
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onIonChange={(e) => setConfirmPassword(e.detail.value || "")}
              className={styles.passwordInput}
            />
          </div>

          {error && (
            <IonText color="danger" className="error-text">
              {error}
            </IonText>
          )}

          <div className={styles.buttonContainer}>
            <IonButton
              expand="block"
              onClick={handleChangePassword}
              disabled={isLoading}
              className={styles.changePasswordButton}
            >
              {isLoading ? "Processing..." : "Change Password"}
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default ChangePasswordPage