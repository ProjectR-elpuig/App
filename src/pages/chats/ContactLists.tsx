import React, { useEffect, useState } from "react";
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
    IonIcon,
    IonPage,
    IonLoading,
} from "@ionic/react";
import { personAddSharp } from "ionicons/icons";
import { useHistory } from 'react-router-dom';
import { useIonViewWillEnter } from '@ionic/react';
import axios from 'axios';
import styles from '../contactos/principal/contactpage.module.css';
import { useAuth } from '../../context/AuthContext';
import { API_CONFIG } from '../../config';

interface Contact {
    contactid: number;
    name: string;
    phoneNumber?: string;
    img?: string;
}

const ContactLists: React.FC = () => {
    const [searchText, setSearchText] = useState("");
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const history = useHistory();

    const fetchContacts = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!user?.token) {
                setError('No autenticado');
                return;
            }

            const response = await axios.get(
                `${API_CONFIG.BASE_URL}/contacts/citizen/${user?.citizenid}`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            );

            const formattedContacts = response.data.map((contact: any) => ({
                contactid: contact.contactid,
                name: contact.name,
                phoneNumber: contact.contacto?.phoneNumber,
                img: contact.contacto?.img
            }));

            setContacts(formattedContacts);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al obtener contactos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, [user?.token]);

    useIonViewWillEnter(() => {
        fetchContacts();
    });

    const handleStartChat = async (contactId: number) => {
        try {
            if (!user?.token) {
                setError('No autenticado');
                return;
            }

            await axios.put(
                `${API_CONFIG.BASE_URL}/contacts/${contactId}/start-chat`,
                { isChatting: 1 },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            );

            history.push(`/chats/chat/${contactId}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al iniciar chat');
        }
    };

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchText.toLowerCase())
    );

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
                <IonLoading isOpen={loading} message="Cargando contactos..." />

                {error && (
                    <div className={styles.errorContainer}>
                        <p className={styles.errorText}>{error}</p>
                    </div>
                )}

                <div className={styles.searchContainer}>
                    <IonSearchbar
                        placeholder="Buscar..."
                        className={styles.customSearchbar}
                        animated={true}
                        value={searchText}
                        onIonInput={(e) => setSearchText(e.detail.value!)}
                    />
                </div>

                <IonList>
                    {filteredContacts.map((contact) => (
                        <IonItem
                            key={contact.contactid}
                            className={styles.chatItems}
                            button
                            onClick={() => handleStartChat(contact.contactid)}
                        >
                            <IonAvatar slot="start" className="avatar">
                                <img
                                    src={`data:image/jpeg;base64,${contact.img}`}
                                    alt={contact.name}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://i.gyazo.com/17f37bb6fd035c2055614479d36c7de2.jpg';
                                    }}
                                />
                            </IonAvatar>
                            <IonLabel className={styles.textUser}>
                                <h2>{contact.name}</h2>
                            </IonLabel>
                        </IonItem>
                    ))}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default ContactLists;