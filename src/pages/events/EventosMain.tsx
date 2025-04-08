import React, { useState } from "react";
import { IonContent, IonHeader, IonToolbar, IonPage, IonIcon, IonFab, IonFabButton, IonModal, IonButton } from "@ionic/react";
import { calendarOutline, closeOutline } from "ionicons/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./EventosMain.module.css";
import { useHistory } from "react-router-dom";

const events = [
  { id: 1, title: "Pet Show Event", image: "/imgs/events.png", description: "Ven a disfrutar con tus mascotas en este evento especial." },
  { id: 2, title: "Music Festival", image: "/imgs/events.png", description: "No te pierdas el mejor festival de música del año." },
  { id: 3, title: "Tech Conference", image: "/imgs/events.png", description: "Explora las nuevas tendencias tecnológicas en esta conferencia." }
];

const EventosMain: React.FC = () => {
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const history = useHistory();

  const toggleActionPanel = () => {
    setShowActionPanel(!showActionPanel);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    console.log("Fecha seleccionada:", date);
  };

  const handleAddEvent = () => {
    history.push("/eventos/add");
  }

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
        <div className={styles.separator}></div>

        <div className={styles.dateContainer}>
          <h2 className={styles.dateText}>Today, 25/11/2024</h2>
        </div>

        {/* Swiper para deslizar eventos */}
        <Swiper slidesPerView={"auto"} spaceBetween={15} centeredSlides={true} pagination={{ clickable: true }} navigation>
          {events.map((event) => (
            <SwiperSlide key={event.id} className={styles.eventCard}>
              <img src={event.image} alt={event.title} className={styles.eventImage} />
              <h3 className={styles.eventTitle}>{event.title}</h3>
              <p className={styles.eventDescription}>{event.description}</p>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Overlay */}
        {showActionPanel && (
          <div className={styles.overlay} onClick={toggleActionPanel}>
            <div className={`${styles.actionPanel} ${showActionPanel ? styles.show : ""}`}>
              <button className={styles.actionButton} onClick={() => setShowCalendar(true)}>
                View Event Calendar
              </button>
              <button className={styles.actionButton} onClick={handleAddEvent}>
                <span className={styles.addIcon}>+</span> Add event
              </button>
            </div>
          </div>
        )}

        {/* Modal del Calendario */}
        <IonModal isOpen={showCalendar} onDidDismiss={() => setShowCalendar(false)}>
          <div className={styles.modalContainer}>
            <h2>Seleccione una fecha</h2>
            <Calendar onChange={(date) => handleDateChange(date as Date)} value={selectedDate} />
            <IonButton onClick={() => setShowCalendar(false)} color="danger">
              <IonIcon icon={closeOutline} />
              Cerrar
            </IonButton>
          </div>
        </IonModal>

        <IonFab vertical="bottom" horizontal="end" slot="fixed" className="fab">
          <IonFabButton onClick={toggleActionPanel} className={`fab-button ${styles.fabButton}`}>
            <IonIcon className={styles.fabIcon} icon={calendarOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default EventosMain;
