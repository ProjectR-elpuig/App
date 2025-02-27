import type React from "react"

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonSearchbar,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonFab,
  IonFabButton,
  IonButtons,
  IonButton,
  IonIcon,
  IonPage,
} from "@ionic/react"
import {
  add,
  chatbox,
  personAddSharp
} from "ionicons/icons"
import { useHistory } from 'react-router-dom';
import { useState } from "react"
// import "./ContactsPage.css"
import styles from './contactpage.module.css';


const contacts = [
  { id: 1, name: "Haylie Baptista", lastMsg: "¿Nos vemos mañana?" },
  { id: 2, name: "Talan Bergson", lastMsg: "¡Gracias por tu ayuda!" },
  { id: 3, name: "Emerson Geidt", lastMsg: "Te llamo más tarde." },
  { id: 4, name: "Lindsey Kenter", lastMsg: "No puedo ahora, luego hablamos." },
  { id: 5, name: "Maria Schleifer", lastMsg: "¿Cómo va todo?" },
  { id: 6, name: "Jakob Passaquindici Arcand", lastMsg: "Estoy en camino." },
  { id: 7, name: "Aspen Rhiel Madsen", lastMsg: "¿Qué planes para el fin de semana?" },
  { id: 8, name: "Marley Ekstrom Bothman", lastMsg: "Todo bien, ¿y tú?" },
  { id: 9, name: "Justin Workman", lastMsg: "Necesito que me confirmes, porfa." },
  { id: 10, name: "Alfonso Korsgaard", lastMsg: "Luego te cuento los detalles." },
  { id: 11, name: "Tatiana Lipshutz", lastMsg: "¿Quedamos para comer?" },
  { id: 12, name: "Carlos Mendoza", lastMsg: "¡Ya está listo!" },
  { id: 13, name: "Samantha Lee", lastMsg: "¿Me envías el archivo?" },
  { id: 14, name: "Miguel Torres", lastMsg: "Hoy no puedo, lo siento." },
  { id: 15, name: "Valeria Soto", lastMsg: "¡Qué emoción verte pronto!" },
  { id: 16, name: "Pedro Díaz", lastMsg: "Reunión a las 3 p.m., ¿te va bien?" },
  { id: 17, name: "Lucía Fernández", lastMsg: "Nos vemos en el parque." },
  { id: 18, name: "Mateo Gómez", lastMsg: "Avísame cuando llegues." },
  { id: 19, name: "Sofía Romero", lastMsg: "No te preocupes, todo bien." },
  { id: 20, name: "Javier Ramírez", lastMsg: "¿Dónde nos encontramos?" }
];

const ContactsPage: React.FC = () => {
  const [searchText, setSearchText] = useState("")

  const history = useHistory();

  const handleRedirect = (id: number) => {
    history.push(`/contactos/perfil/${id}`);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAddContact = () => {
    history.push("/contactos/agregar")
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary" className={styles.headerToolbar}>
          <div className={styles.logoContainer}>
            <h1>V-LINK</h1>
            <img src="/imgs/LogoTopBar.png" alt="V-Link Logo" className={styles.topbarLogo} />
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
      <div className={styles.searchContainer}>
          <IonSearchbar placeholder="Buscar..." className={styles.customSearchbar} animated={true} value={searchText} onIonInput={(e) => setSearchText(e.detail.value!)} />
        </div>

        <IonList>
          {filteredContacts.map((contact, i) => (
            <IonItem
              key={contact.id}
              className={styles.chatItems}
              button // Hace que el IonItem sea clickeable
              onClick={() => handleRedirect(contact.id)}
            >
              <IonAvatar slot="start" className="avatar">
                <img src={`https://randomuser.me/api/portraits/${contact.id - 1 % 2 == 0 ? "" : "wo"}men/${contact.id}.jpg`} alt={contact.name} />
              </IonAvatar>
              <IonLabel className={styles.textUser}>
                <h2>{contact.name}</h2>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
        {/* Floating Action Button */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed" className="fab">
          <IonFabButton onClick={handleAddContact} className={`fab-button ${styles.fabButton}`}>
            <IonIcon className={styles.fabIcon} icon={personAddSharp} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  )
}

export default ContactsPage

