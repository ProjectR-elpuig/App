import type React from "react"
import { useParams, useHistory } from "react-router-dom";
import { IonPage, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonContent } from "@ionic/react"
import { arrowBack, pencil, wifiOutline, chatbubbleEllipses, call, ban, trash } from "ionicons/icons"
import styles from "./ContactDetail.module.css"

const contacts = [
    { name: "Haylie Baptista", lastMsg: "¿Nos vemos mañana?" },
    { name: "Talan Bergson", lastMsg: "¡Gracias por tu ayuda!" },
    { name: "Emerson Geidt", lastMsg: "Te llamo más tarde." },
    { name: "Lindsey Kenter", lastMsg: "No puedo ahora, luego hablamos." },
    { name: "Maria Schleifer", lastMsg: "¿Cómo va todo?" },
    { name: "Jakob Passaquindici Arcand", lastMsg: "Estoy en camino." },
    { name: "Aspen Rhiel Madsen", lastMsg: "¿Qué planes para el fin de semana?" },
    { name: "Marley Ekstrom Bothman", lastMsg: "Todo bien, ¿y tú?" },
    { name: "Justin Workman", lastMsg: "Necesito que me confirmes, porfa." },
    { name: "Alfonso Korsgaard", lastMsg: "Luego te cuento los detalles." },
    { name: "Tatiana Lipshutz", lastMsg: "¿Quedamos para comer?" },
    { name: "Carlos Mendoza", lastMsg: "¡Ya está listo!" },
    { name: "Samantha Lee", lastMsg: "¿Me envías el archivo?" },
    { name: "Miguel Torres", lastMsg: "Hoy no puedo, lo siento." },
    { name: "Valeria Soto", lastMsg: "¡Qué emoción verte pronto!" },
    { name: "Pedro Díaz", lastMsg: "Reunión a las 3 p.m., ¿te va bien?" },
    { name: "Lucía Fernández", lastMsg: "Nos vemos en el parque." },
    { name: "Mateo Gómez", lastMsg: "Avísame cuando llegues." },
    { name: "Sofía Romero", lastMsg: "No te preocupes, todo bien." },
    { name: "Javier Ramírez", lastMsg: "¿Dónde nos encontramos?" }
];

const ContactDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Obtiene el ID de la URL
    const history = useHistory();

    const generatePhoneNumber = (): string => {
        // Genera un número aleatorio de 9 dígitos como string
        const randomNumber = Math.floor(100000000 + Math.random() * 900000000).toString();

        // Formatea el número como "123 45 67 89"
        return `${randomNumber.slice(0, 3)} ${randomNumber.slice(3, 5)} ${randomNumber.slice(5, 7)} ${randomNumber.slice(7, 9)}`;
    };

    const onBack = (): void => {
        history.push("/contactos");
    }

    const onEdit = (): void => {
        history.push(`/contactos/perfil/${id}/edit`);
    }

    return (
        <IonPage>
            {/* Header */}
            <IonHeader className="ion-no-border">
                <IonToolbar className={styles.toolbar}>
                    <IonButtons slot="start">
                        <IonButton onClick={onBack} className={styles.iconButton}>
                            <IonIcon icon={arrowBack} />
                        </IonButton>
                    </IonButtons>
                    <IonButtons slot="end">
                        <IonButton onClick={onEdit} className={styles.iconButton}>
                            <IonIcon icon={pencil} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent className={styles.content}>
                <div className={styles.profileContainer}>
                    {/* Profile Image */}
                    <div className={styles.profileImage}>
                        <img src={
                            contacts[id] ?
                            `https://randomuser.me/api/portraits/${id - 1 % 2 == 0 ? "" : "wo"}men/${id}.jpg` :
                            "https://i.gyazo.com/17f37bb6fd035c2055614479d36c7de2.jpg"} alt="Profile" />
                            id
                    </div>

                    {/* Name */}
                    <h1 className={styles.name}>{contacts[id] ? contacts[id].name : "hola"}</h1>

                    {/* Message Button */}
                    <button className={styles.messageButton}>
                        <IonIcon icon={chatbubbleEllipses} />
                        <span>Mensaje</span>
                    </button>

                    {/* Contact Information */}
                    <div className={styles.infoSection}>
                        <h2 className={styles.infoTitle}>Contact Information</h2>
                        <div className={styles.phoneNumber}>
                            <IonIcon icon={call} />
                            <span>{generatePhoneNumber()}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className={styles.actionButtons}>
                        <button className={styles.blockButton}>
                            <IonIcon icon={ban} />
                            <span>Block contact</span>
                        </button>
                        <button className={styles.deleteButton}>
                            <IonIcon icon={trash} />
                            <span>Delete contact</span>
                        </button>
                    </div>
                </div>

                {/* Footer Logo */}
                <div className={styles.footer}>
                    <div className={styles.logo}>
                        <span>V-LINK</span>
                        <img src="/imgs/LogoTopBar.png" alt="V-Link Logo" className="topbarlogo" />
                    </div>
                </div>
            </IonContent>
        </IonPage>
    )
}

export default ContactDetail

