import type React from "react"
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
    IonFooter,
} from "@ionic/react"
import { arrowBack, camera, trash, wifiOutline } from "ionicons/icons"
import { useHistory, useParams } from "react-router-dom"
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import styles from "./AddOrEditContact.module.css"

interface Contact {
    id?: string
    name: string
    surname: string
    phoneNumber: string
}

interface AddOrEditContactProps {
    contact?: Contact
    onSave?: (contact: Contact) => void
    onCancel?: () => void
}

const AddOrEditContact: React.FC<AddOrEditContactProps> = ({ contact, onSave, onCancel }) => {
    const { id } = useParams<{ id: string }>(); // Obtiene el ID desde la URL
    const history = useHistory()
    const [formData, setFormData] = useState<Contact>(
        contact || {
            name: "",
            surname: "",
            phoneNumber: "",
        },
    )

    const [imageSrc, setImageSrc] = useState(
        id
        ? `https://randomuser.me/api/portraits/${(id - 1) % 2 === 0 ? "" : "wo"}men/${id}.jpg`
        : "https://i.gyazo.com/17f37bb6fd035c2055614479d36c7de2.jpg"
    );

    const handleChange = (field: keyof Contact, value: string) => {
        setFormData({
            ...formData,
            [field]: value,
        })
    }

    const handleSave = () => {
        // if (onSave) {
        //   onSave(formData)
        // }
        history.goBack()
    }

    const handleCancel = () => {
        // if (onCancel) {
        //   onCancel()
        // } else {
        //   history.goBack()
        // }
        history.goBack()
    }

    const handleOpenCamera = async () => {
        console.log("Open Camera")
        try {
        const photo = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera, // Usa `CameraSource.Photos` si quieres abrir la galería
            quality: 90
        });
    
        console.log("Foto tomada:", photo.webPath); // URL de la foto tomada
        if (photo.webPath) {
            setImageSrc(photo.webPath);
        }
        } catch (error) {
        console.error("Error al abrir la cámara", error);
        }
    }

    return (
        <IonPage className={styles.page}>

            {/* Header */}
            <IonHeader className="ion-no-border">
                <IonToolbar className={styles.toolbar}>
                    <IonButtons slot="start">
                        <IonButton onClick={handleCancel} className={styles.backButton}>
                            <IonIcon icon={arrowBack} slot="icon-only" />
                        </IonButton>
                    </IonButtons>
                    <div className={styles.logoContainer}>
                        <h1>V-LINK</h1>
                        <img src="./imgs/LogoTopBar.png" alt="" />
                    </div>
                </IonToolbar>
            </IonHeader>

            <IonContent className={styles.content}>
                {/* Profile Photo */}
                <div className={styles.profilePhotoContainer}>
                    <div className={styles.profilePhoto}>
                        <img onClick={handleOpenCamera} style={{ cursor: "pointer" }}  src={imageSrc}
                            alt="Foto Perfil" />
                        <div className={styles.photoEditButton}>
                            <IonIcon icon={camera} />
                        </div>
                    </div>
                </div>

                {/* Form Fields */}
                <div className={styles.formFields}>
                    <IonInput
                        className={styles.input}
                        placeholder="name"
                        value={formData.name}
                        onIonChange={(e) => handleChange("name", e.detail.value!)}
                    />

                    <IonInput
                        className={styles.input}
                        placeholder="surname"
                        value={formData.surname}
                        onIonChange={(e) => handleChange("surname", e.detail.value!)}
                    />

                    <IonInput
                        className={styles.input}
                        placeholder="phone number (FiveM)"
                        value={formData.phoneNumber}
                        onIonChange={(e) => handleChange("phoneNumber", e.detail.value!)}
                    />
                </div>

                {/* Confirm Button */}
                <div className={styles.buttonContainer}>
                    <IonButton expand="block" className={styles.confirmButton} onClick={handleSave}>
                        {
                            id
                            ? "Editar Contacto"
                            : "Crear Contacto"
                        }
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

export default AddOrEditContact;