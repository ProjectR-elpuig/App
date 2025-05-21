import { useState, useEffect } from "react"
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
import { useHistory, useParams, useLocation } from "react-router-dom"
import styles from "./AddOrEditContact.module.css"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"
import { API_CONFIG } from '../../config';

interface Contact {
  contactid?: number
  name: string
  phoneNumber: string
  img?: string
}

const AddOrEditContact: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const history = useHistory()
  const location = useLocation()
  const { user } = useAuth()
  const [formData, setFormData] = useState<Contact>({
    name: "",
    phoneNumber: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

  // Cargar datos del contacto si estamos en modo edición
  useEffect(() => {
    const loadContactData = async () => {
      if (id) {
        try {
          setLoading(true)
          const response = await axios.get(`${API_CONFIG.BASE_URL}/contacts/${id}`, {
            headers: {
              Authorization: `Bearer ${user?.token}`
            }
          })

          setFormData({
            name: response.data.name,
            phoneNumber: response.data.contacto.phoneNumber,
            img: response.data.contacto?.img
              ? response.data.contacto.img
              : "https://i.gyazo.com/17f37bb6fd035c2055614479d36c7de2.jpg"
          })

        } catch (err: any) {
          setError(err.response?.data?.message || 'Error al cargar contacto')
        } finally {
          setLoading(false)
          setInitialLoad(false)
        }
      } else {
        setInitialLoad(false)
      }
    }

    // Intentar obtener datos de la navegación primero
    if (location.state?.contact) {
      console.log("Entro aqui", id);
      setFormData(location.state.contact)
      console.log("FormData", JSON.stringify(formData));
      setInitialLoad(false)
    } else {
      loadContactData()
    }
  }, [id, user?.token])

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
      if (!user?.token || !user?.citizenid) {
        throw new Error("No autenticado")
      }

      const payload = {
        citizenId: user.citizenid,
        name: formData.name,
        phoneNumber: formData.phoneNumber
      }

      // Determinar si es creación o edición
      if (id) {
        await axios.put(`${API_CONFIG.BASE_URL}/contacts/${id}`, payload, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json"
          }
        })
      } else {
        await axios.post(`${API_CONFIG.BASE_URL}/contacts`, payload, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json"
          }
        })
      }

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

  if (initialLoad) {
    return (
      <IonPage>
        <IonContent className={styles.loadingContainer}>
          <p>Cargando datos del contacto...</p>
        </IonContent>
      </IonPage>
    )
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
              src={`data:image/jpeg;base64,${formData.img}` || 'https://i.gyazo.com/17f37bb6fd035c2055614479d36c7de2.jpg'}
              alt="Foto Perfil"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://i.gyazo.com/17f37bb6fd035c2055614479d36c7de2.jpg';
              }}
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
            <span>Cancelar</span>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default AddOrEditContact