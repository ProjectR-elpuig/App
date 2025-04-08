import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonPage,
  IonInput,
  IonTextarea,
} from '@ionic/react';
import { arrowBack, wifiOutline, calendarOutline, imageOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useHistory, useParams } from "react-router-dom"
import styles from './EventosAdd.module.css';

const EventosAdd: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const history = useHistory()

  const handleCreateEvent = () => {
    // Aquí iría la lógica para crear el evento
    console.log('Creating event:', { title, description, date, image });
    history.goBack();
    // Redirigir a la página de eventos o mostrar un mensaje de éxito
  };

  const handleChooseDate = () => {
    // Aquí iría la lógica para abrir un selector de fecha
    console.log('Opening date picker');
    history.goBack();
  };

  const handleChooseImage = () => {
    // Aquí iría la lógica para abrir un selector de imagen
    console.log('Opening image picker');
    history.goBack();
  };

  const handleCancel = () => {
    history.goBack();
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

      <IonContent fullscreen>
        {/* Separator Line */}
        <div className={styles.separator}></div>

        {/* Page Title */}
        <div className={styles.pageTitle}>
          <h2>Create new event</h2>
        </div>

        {/* Event Form */}
        <div className={styles.formContainer}>
          {/* Title Input */}
          <IonInput
            type="text"
            placeholder="title"
            value={title}
            onIonChange={e => setTitle(e.detail.value || '')}
            className={styles.titleInput}
          />

          {/* Description Textarea */}
          <IonTextarea
            placeholder="description"
            value={description}
            onIonChange={e => setDescription(e.detail.value || '')}
            className={styles.descriptionInput}
            rows={8}
          />

          {/* Date Button */}
          <button
            className={styles.optionButton}
            onClick={handleChooseDate}
          >
            <IonIcon icon={calendarOutline} className={styles.optionIcon} />
            Choose a date
          </button>

          {/* Image Button */}
          <button
            className={styles.optionButton}
            onClick={handleChooseImage}
          >
            <IonIcon icon={imageOutline} className={styles.optionIcon} />
            Choose a image
          </button>

          {/* Create Button */}
          <button
            className={styles.createButton}
            onClick={handleCreateEvent}
          >
            Create Event
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EventosAdd;
