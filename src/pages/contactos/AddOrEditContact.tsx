import { useState } from "react"
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonContent,
  IonInput,
  IonIcon,
} from "@ionic/react"
import { arrowBack, trash } from "ionicons/icons"
import { useHistory, useParams } from "react-router-dom"
import styles from "./AddOrEditContact.module.css"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"
import { API_CONFIG } from '../../config';

interface Contact {
  contactid?: number
  name: string
  phoneNumber: string
}

const AddOrEditContact: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const history = useHistory()
  const { user } = useAuth()
  const [formData, setFormData] = useState<Contact>({
    name: "",
    phoneNumber: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (field: keyof Contact, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleSave = async () => {
    setLoading(true)
    setError(null)

    try {
      if (!user?.token) {
        throw new Error("No autenticado")
      }

      await axios.post(`${API_CONFIG.BASE_URL}/contacts`,
        {
          citizenId: user.citizenid,
          name: formData.name,
          phoneNumber: formData.phoneNumber
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json"
          }
        }
      )

      history.push("/contactos")
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Error al guardar")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    history.goBack()
  }

  return (
    <IonPage className={styles.page}>
      <IonHeader className="ion-no-border">
        <IonToolbar className={styles.toolbar}>
          <IonButtons slot="start">
            <IonButton onClick={handleCancel} className={styles.backButton}>
              <IonIcon icon={arrowBack} slot="icon-only" />
            </IonButton>
          </IonButtons>
          <div className={styles.logoContainer}>
            <h1>V-LINK</h1>
            <img src="/imgs/LogoTopBar.png" alt="Logo" />
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className={styles.content}>
        {/* Imagen fija */}
        <div className={styles.profilePhotoContainer}>
          <div className={styles.profilePhoto}>
            <img
              src="https://i.gyazo.com/17f37bb6fd035c2055614479d36c7de2.jpg"
              alt="Foto Perfil"
            />
          </div>
        </div>

        {/* Campos del formulario */}
        <div className={styles.formFields}>
          <IonInput
            className={styles.input}
            placeholder="Nombre"
            value={formData.name}
            onIonChange={(e) => handleChange("name", e.detail.value!)}
          />

          <IonInput
            className={styles.input}
            placeholder="Número de teléfono"
            value={formData.phoneNumber}
            onIonChange={(e) => handleChange("phoneNumber", e.detail.value!)}
          />
        </div>

        {/* Mensaje de error */}
        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* Botones */}
        <div className={styles.buttonContainer}>
          <IonButton
            expand="block"
            className={styles.confirmButton}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Guardando..." : (id ? "Editar Contacto" : "Crear Contacto")}
          </IonButton>

          <div className={styles.cancelButton} onClick={handleCancel}>
            <IonIcon icon={trash} />
            <span>Cancelar</span>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default AddOrEditContact