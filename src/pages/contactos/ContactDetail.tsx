import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { IonPage, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonContent, IonLoading, IonText } from "@ionic/react";
import { arrowBack, pencil, chatbubbleEllipses, call, ban, trash } from "ionicons/icons";
import axios from 'axios';
import styles from "./ContactDetail.module.css";
import { useAuth } from "../../context/AuthContext";
import { API_CONFIG } from '../../config';

interface Contact {
  contactid: number;
  name: string;
  phoneNumber?: string;
  img?: string;
  isBlocked?: boolean; // Nuevo campo
}

const ContactDetail: React.FC = () => {
  const { id: contactid } = useParams<{ id: string }>();
  const history = useHistory();
  const { user } = useAuth();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        if (!user?.token) {
          throw new Error('No autenticado');
        }

        const response = await axios.get(
          `${API_CONFIG.BASE_URL}/contacts/${contactid}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        );

        // En tu código donde procesas la respuesta
        console.log('Respuesta de la API:', response.data);

        // Formatea el objeto individual (no uses map)
        const formattedContact = {
          contactid: response.data.contactid,
          name: response.data.name,
          phoneNumber: response.data.contacto?.phoneNumber ?? 'Número no disponible',
          img: response.data.contacto?.img
            ? `${response.data.contacto.img}`
            : '/imgs/default-avatar.jpg',
          isBlocked: response.data.isBlocked // Añadir esta línea
        };

        if (!response.data) {
          throw new Error('Contacto no encontrado');
        }

        console.log("Contacto formateado:", formattedContact);
        setContact(formattedContact);
      } catch (err: any) {
        setError(err.message || 'Error al cargar el contacto');
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [contactid, user?.token]);

  const onBack = (): void => {
    history.push("/contactos");
  }

  const onEdit = (): void => {
    history.push(`/contactos/perfil/${contactid}/edit`, {
      contact: {
        name: contact.name,
        phoneNumber: contact.phoneNumber,
        contactid: contact.contactid,
        img: contact.img
      }
    });
  }

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de eliminar este contacto?')) {
      try {
        if (!user?.token) throw new Error('No autenticado');

        await axios.delete(
          `${API_CONFIG.BASE_URL}/contacts/${contactid}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        history.push("/contactos");
      } catch (err: any) {
        setError(err.response?.data || 'Error al eliminar el contacto');
      }
    }
  };

  const handleBlock = async () => {
    try {
      if (!user?.token) throw new Error('No autenticado');

      await axios.put(
        `${API_CONFIG.BASE_URL}/contacts/${contactid}/block`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setContact(prev => prev ? { ...prev, isBlocked: !prev.isBlocked } : null);
    } catch (err: any) {
      setError(err.response?.data || 'Error al bloquear el contacto');
    }
  };


  if (loading) {
    return <IonLoading isOpen={true} message="Cargando contacto..." />;
  }

  if (error) {
    return (
      <IonPage>
        <IonContent className={styles.errorContainer}>
          <IonText color="danger">{error}</IonText>
          <IonButton onClick={onBack}>Volver a contactos</IonButton>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
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
        {contact && (
          <div className={styles.profileContainer}>
            {/* Imagen desde base64 */}
            <div className={styles.profileImage}>
              <img
                src={`data:image/jpeg;base64,${contact.img}`}
                alt="Profile"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://i.gyazo.com/17f37bb6fd035c2055614479d36c7de2.jpg';
                }}
              />
            </div>

            <h1 className={styles.name}>{contact.name}</h1>

            <button className={styles.messageButton}>
              <IonIcon icon={chatbubbleEllipses} />
              <span>Mensaje</span>
            </button>

            <div className={styles.infoSection}>
              <h2 className={styles.infoTitle}>Información de contacto</h2>
              <div className={styles.phoneNumber}>
                <IonIcon icon={call} />
                <span>{contact.phoneNumber}</span>
              </div>
            </div>

            <div className={styles.actionButtons}>
              <button className={styles.blockButton} onClick={handleBlock}>
                <IonIcon icon={ban} />
                <span>{contact.isBlocked ? "Desbloquear contacto" : "Bloquear contacto"}</span>
              </button>
              <button className={styles.deleteButton} onClick={handleDelete}>
                <IonIcon icon={trash} />
                <span>Eliminar contacto</span>
              </button>
            </div>
          </div>
        )}

        <div className={styles.footer}>
          <div className={styles.logo}>
            <span>V-LINK</span>
            <img src="/imgs/LogoTopBar.png" alt="V-Link Logo" className="topbarlogo" />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default ContactDetail;