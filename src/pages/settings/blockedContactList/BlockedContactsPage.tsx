import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonButtons,
  IonButton,
  IonIcon,
  IonPage,
} from "@ionic/react";
import { arrowBack, ban } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import styles from "./BlockedContactsPage.module.css";
import axios from 'axios';
import { API_CONFIG } from '../../../config';
import { useAuth } from "../../../context/AuthContext";

interface Contacto {
  contactid: number;
  name: string;
  contacto: {
    phoneNumber?: string;
    img?: string;
  };
  isBlocked: boolean;
}

const BlockedContactsPage: React.FC = () => {
  const history = useHistory();
  const { user } = useAuth();
  const [blockedContacts, setBlockedContacts] = useState<Contacto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlockedContacts = async () => {
      try {
        if (!user?.token) throw new Error('No autenticado');

        const response = await axios.get(
          `${API_CONFIG.BASE_URL}/contacts/blocked`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        );

        setBlockedContacts(response.data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar contactos bloqueados');
      } finally {
        setLoading(false);
      }
    };

    fetchBlockedContacts();
  }, [user?.token]);

  const handleUnblock = async (contactId: number) => {
    try {
      if (!user?.token) throw new Error('No autenticado');

      await axios.put(
        `${API_CONFIG.BASE_URL}/contacts/${contactId}/block`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      // Actualizar lista local
      setBlockedContacts(prev => prev.filter(c => c.contactid !== contactId));
    } catch (err: any) {
      setError(err.response?.data || 'Error al desbloquear contacto');
    }
  };

  const onBack = (): void => {
    history.push("/settings");
  };

  if (loading) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          Loading blocked contacts...
        </IonContent>
      </IonPage>
    );
  }

  if (error) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <p style={{ color: "red" }}>{error}</p>
          <IonButton onClick={onBack}>Volver</IonButton>
        </IonContent>
      </IonPage>
    );
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
          <h2>Contactos bloqueados</h2>
        </div>

        <IonList className={styles.contactList}>
          {blockedContacts.map((contact) => (
            <IonItem key={contact.contactid} lines="none" className={styles.contactItem}>
              <IonAvatar slot="start">
                <img
                  src={contact.contacto?.img
                    ? `data:image/jpeg;base64,${contact.contacto.img}`
                    : '/imgs/default-avatar.jpg'}
                  alt={contact.name}
                />
              </IonAvatar>
              <IonLabel className={styles.textUser}>
                <h2>{contact.name}</h2>
                <p>Estado: {contact.isBlocked ? "Bloqueado" : "No bloqueado"}</p>
              </IonLabel>
              <IonButton
                color="danger"
                onClick={() => handleUnblock(contact.contactid)}
              >
                <IonIcon icon={ban} slot="start" />
                Desbloquear
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default BlockedContactsPage;