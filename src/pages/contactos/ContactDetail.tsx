import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { IonPage, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonContent, IonLoading, IonText, HrefProps } from "@ionic/react";
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
  isBlocked?: boolean;
  isChatting?: boolean;
}

interface Props {
  hideMessageButton?: boolean;
  customBackRoute?: string;
}

const ContactDetail: React.FC<Props> = ({
  hideMessageButton = false,
  customBackRoute
}) => {
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
          throw new Error('Not authenticated');
        }

        const response = await axios.get(
          `${API_CONFIG.BASE_URL}/contacts/${contactid}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        );

        const formattedContact = {
          contactid: response.data.contactid,
          name: response.data.name,
          phoneNumber: response.data.contacto?.phoneNumber ?? 'Number not available',
          img: response.data.contacto?.img
            ? `${response.data.contacto.img}`
            : '/imgs/default-avatar.jpg',
          isBlocked: response.data.isBlocked,
          isChatting: response.data.isChatting
        };

        if (!response.data) {
          throw new Error('Contact not found');
        }

        setContact(formattedContact);
      } catch (err: any) {
        setError(err.message || 'Error loading contact');
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [contactid, user?.token]);

  const onBack = (): void => {
    history.push(customBackRoute || "/contactos");
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
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        if (!user?.token) throw new Error('Not authenticated');

        await axios.delete(
          `${API_CONFIG.BASE_URL}/contacts/${contactid}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        history.push("/contactos");
      } catch (err: any) {
        setError(err.response?.data || 'Error deleting contact');
      }
    }
  };

  const handleBlock = async () => {
    try {
      if (!user?.token) throw new Error('Not authenticated');

      await axios.put(
        `${API_CONFIG.BASE_URL}/contacts/${contactid}/block`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setContact(prev => prev ? { ...prev, isBlocked: !prev.isBlocked } : null);
    } catch (err: any) {
      setError(err.response?.data || 'Error blocking contact');
    }
  };

  const handleChatting = async () => {
    try {
      if (!user?.token) throw new Error('Not authenticated');

      await axios.put(
        `${API_CONFIG.BASE_URL}/contacts/${contactid}/chatting`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setContact(prev => prev ? { ...prev, isChatting: !prev.isChatting } : null);
    } catch (err: any) {
      setError(err.response?.data || 'Error closing chat');
    }
  };

  const handleStartChat = async () => {
    try {
      if (!user?.token) throw new Error('Not authenticated');

      await axios.put(
        `${API_CONFIG.BASE_URL}/contacts/${contactid}/start-chat`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      history.push(`/chats/chat/${contactid}`);
    } catch (err: any) {
      setError(err.response?.data || 'Error starting chat');
    }
  };


  if (loading) {
    return <IonLoading isOpen={true} message="Loading contact..." />;
  }

  if (error) {
    return (
      <IonPage>
        <IonContent className={styles.errorContainer}>
          <IonText color="danger">{error}</IonText>
          <IonButton onClick={onBack}>Back to contacts</IonButton>
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
            {/* Image from base64 */}
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

            {!contact.isBlocked && !hideMessageButton && (
              <button className={styles.messageButton} onClick={handleStartChat}>
                <IonIcon icon={chatbubbleEllipses} />
                <span>Message</span>
              </button>
            )}

            <div className={styles.infoSection}>
              <h2 className={styles.infoTitle}>Contact info</h2>
              <div className={styles.phoneNumber}>
                <IonIcon icon={call} />
                <span>{contact.phoneNumber}</span>
              </div>
            </div>

            <div className={styles.actionButtons}>
              <button className={styles.blockButton} onClick={handleBlock}>
                <IonIcon icon={ban} />
                <span>{contact.isBlocked ? "Unblock contact" : "Block contact"}</span>
              </button>
              {contact.isChatting && (
                <button className={styles.blockButton} onClick={handleChatting}>
                  <IonIcon icon={chatbubbleEllipses} />
                  <span>{contact.isChatting && "Close chat"}</span>
                </button>
              )}
              <button className={styles.deleteButton} onClick={handleDelete}>
                <IonIcon icon={trash} />
                <span>Delete contact</span>
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
