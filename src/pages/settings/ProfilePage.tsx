import React, { useState, useEffect } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonInput,
    IonLabel,
    IonAvatar,
    IonText
} from '@ionic/react';
import { arrowBack, camera, trash, call, person } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { API_CONFIG } from '../../config';
import styles from './ProfilePage.module.css';

const ProfilePage: React.FC = () => {
    const history = useHistory();
    const { user } = useAuth();
    const [profile, setProfile] = useState({
        username: '',
        phoneNumber: '',
        img: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${API_CONFIG.BASE_URL}/profile`, {
                    headers: {
                        'Authorization': `Bearer ${user?.token}`
                    }
                });
                setProfile({
                    username: response.data.username,
                    phoneNumber: response.data.phoneNumber,
                    img: response.data.img ? `data:image/jpeg;base64,${response.data.img}` : '/imgs/default-avatar.jpg'
                });
            } catch (err) {
                setError('Error al cargar el perfil');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleBack = () => {
        history.goBack();
    };

    const handleUsernameChange = (e: CustomEvent) => {
        setProfile({ ...profile, username: e.detail.value || '' });
    };

    const handleSave = async () => {
        try {
            await axios.put(`${API_CONFIG.BASE_URL}/profile`, {
                username: profile.username
            }, {
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            });
            // Actualizar el contexto de autenticación si es necesario
        } catch (err) {
            setError('Error al guardar los cambios');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!user?.token) {
            setError('No autenticado');
            return;
        }
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await axios.post(`${API_CONFIG.BASE_URL}/profile/image`, formData, {
                    headers: {
                        'Authorization': `Bearer ${user?.token}`,
                        //'Content-Type': 'multipart/form-data'
                    }
                });

                setProfile({
                    ...profile,
                    img: response.data.img ? `data:image/jpeg;base64,${response.data.img}` : '/imgs/default-avatar.jpg'
                });
            } catch (err) {
                setError('Error al subir la imagen');
            }
        }
    };

    const handleDeleteImage = async () => {
        try {
            const response = await axios.delete(`${API_CONFIG.BASE_URL}/profile/image`, {
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            });

            setProfile({
                ...profile,
                img: '/imgs/default-avatar.jpg'
            });
        } catch (err) {
            setError('Error al eliminar la imagen');
        }
    };

    if (loading) {
        return (
            <IonPage>
                <IonContent className={styles.page}>
                    <IonText>Loading profile...</IonText>
                </IonContent>
            </IonPage>
        );
    }

    return (
        <IonPage className={styles.page}>
            <IonHeader className="ion-no-border">
                <IonToolbar className={styles.headerToolbar}>
                    <IonButtons slot="start">
                        <IonButton onClick={handleBack} className={styles.backButton}>
                            <IonIcon icon={arrowBack} slot="icon-only" />
                        </IonButton>
                    </IonButtons>
                    <div className={styles.logoContainer}>
                        <h1>V-LINK</h1>
                        <img src="/imgs/LogoTopBar.png" alt="Logo" />
                    </div>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <div className={styles.profilePhotoContainer}>
                    <div className={styles.profilePhoto}>
                        <img src={profile.img} alt="Foto de perfil" />
                        <label htmlFor="imageUpload" className={styles.photoEditButton}>
                            <IonIcon icon={camera} />
                        </label>
                        <input
                            id="imageUpload"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageUpload}
                        />
                        {profile.img !== '/imgs/default-avatar.jpg' && (
                            <button
                                onClick={handleDeleteImage}
                                className={`${styles.photoEditButton} ${styles.delete}`}
                            >
                                <IonIcon icon={trash} />
                            </button>
                        )}
                    </div>
                </div>

                <div className={styles.infoSection}>
                    <h2 className={styles.infoTitle}>My profile</h2>

                    <div className={styles.phoneNumber}>
                        <IonIcon icon={person} />
                        <span>{profile.username}</span>
                    </div>

                    <div className={styles.phoneNumber}>
                        <IonIcon icon={call} />
                        <span>{profile.phoneNumber}</span>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default ProfilePage;