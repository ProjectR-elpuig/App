import type React from "react"
import { IonContent, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonPage, IonInput } from "@ionic/react"
import { arrowBack } from "ionicons/icons"
import { useState } from "react"
import { useHistory } from "react-router-dom"
import styles from "./ChangePasswordPage.module.css"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"
import { API_CONFIG } from '../../config'

const ChangePasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [currentPassword, setCurrentPassword] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const history = useHistory()
  const { user } = useAuth()

  const handleChangePassword = async () => {
    if (!currentPassword) {
      alert("Por favor ingresa tu contraseña actual")
      return
    }

    if (newPassword !== confirmPassword) {
      alert("Las nuevas contraseñas no coinciden")
      return
    }

    if (newPassword.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres")
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
        alert("¡Contraseña actualizada correctamente!")
        history.push("/settings")
      }
    } catch (error: any) {
      console.error("Error cambiando contraseña:", error)

      let errorMessage = "Error al cambiar la contraseña"
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = error.response.data || "Datos inválidos"
            break
          case 401:
            errorMessage = "No autorizado - Token inválido"
            break
          case 404:
            errorMessage = "Endpoint no encontrado"
            break
          default:
            errorMessage = `Error del servidor (${error.response.status})`
        }
      } else if (error.request) {
        errorMessage = "No se recibió respuesta del servidor"
      }

      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const onBack = (): void => {
    history.push("/settings")
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
        <div className={styles.pageTitle}>
          <h2>Cambiar Contraseña</h2>
        </div>

        <div className={styles.formContainer}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Contraseña Actual</label>
            <IonInput
              type="password"
              placeholder="Ingresa tu contraseña actual"
              value={currentPassword}
              onIonChange={(e) => setCurrentPassword(e.detail.value || "")}
              className={styles.passwordInput}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Nueva Contraseña</label>
            <IonInput
              type="password"
              placeholder="Ingresa nueva contraseña"
              value={newPassword}
              onIonChange={(e) => setNewPassword(e.detail.value || "")}
              className={styles.passwordInput}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Confirmar Nueva Contraseña</label>
            <IonInput
              type="password"
              placeholder="Confirma tu nueva contraseña"
              value={confirmPassword}
              onIonChange={(e) => setConfirmPassword(e.detail.value || "")}
              className={styles.passwordInput}
            />
          </div>

          <button
            className={styles.changePasswordButton}
            onClick={handleChangePassword}
            disabled={isLoading}
          >
            {isLoading ? "Procesando..." : "Cambiar Contraseña"}
          </button>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default ChangePasswordPage