import type React from "react"
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonIcon,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
} from "@ionic/react"
import { wifiOutline, arrowUpOutline, arrowDownOutline } from "ionicons/icons"
import styles from "./HistoryPage.module.css"

interface HistoryItem {
  id: string
  name: string
  date: string
  time: string
  direction: "incoming" | "outgoing"
  status: "success" | "missed"
}

const historyData: HistoryItem[] = [
  {
    id: "1",
    name: "Nolan Franci",
    date: "27 of november",
    time: "8:36",
    direction: "outgoing",
    status: "missed",
  },
  {
    id: "2",
    name: "Anika Rosser",
    date: "27 of november",
    time: "8:36",
    direction: "incoming",
    status: "success",
  },
  {
    id: "3",
    name: "Roger Geidt",
    date: "27 of november",
    time: "8:36",
    direction: "incoming",
    status: "success",
  },
  {
    id: "4",
    name: "Alfonso Mango",
    date: "27 of november",
    time: "8:36",
    direction: "incoming",
    status: "success",
  },
  {
    id: "5",
    name: "Lincoln Schleifer",
    date: "27 of november",
    time: "8:36",
    direction: "outgoing",
    status: "missed",
  },
  {
    id: "6",
    name: "Gretchen Franci",
    date: "27 of november",
    time: "8:36",
    direction: "incoming",
    status: "success",
  },
  {
    id: "7",
    name: "Emery Carder",
    date: "27 of november",
    time: "8:36",
    direction: "outgoing",
    status: "missed",
  },
  {
    id: "8",
    name: "Chance Rosser",
    date: "27 of november",
    time: "8:36",
    direction: "outgoing",
    status: "missed",
  },
  {
    id: "9",
    name: "Talan Franci",
    date: "27 of november",
    time: "8:36",
    direction: "incoming",
    status: "success",
  },
  {
    id: "10",
    name: "Abram Vaccaro",
    date: "27 of november",
    time: "8:36",
    direction: "outgoing",
    status: "missed",
  },
  {
    id: "11",
    name: "Terry Rhiel Madsen",
    date: "27 of november",
    time: "8:36",
    direction: "outgoing",
    status: "missed",
  },
]

const HistoryPage: React.FC = () => {
  const getCallIcon = (direction: string, status: string) => {
    if (direction === "incoming" && status === "success") {
      return (
        <div className={styles.arrowGreen}>
          <IonIcon icon={arrowDownOutline} />
        </div>
      )
    } else if (direction === "outgoing" && status === "success") {
      return (
        <div className={styles.arrowGreen}>
          <IonIcon icon={arrowUpOutline} />
        </div>
      )
    } else if (direction === "incoming" && status === "missed") {
      return (
        <div className={styles.arrowRed}>
          <IonIcon icon={arrowDownOutline} />
        </div>
      )
    } else {
      return (
        <div className={styles.arrowRed}>
          <IonIcon icon={arrowUpOutline} />
        </div>
      )
    }
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

      <div className={styles.separator}></div>

      <div className={styles.titleContainer}>
        <h2 className={styles.title}>History</h2>
      </div>

      <IonContent className={styles.content}>
        <IonList lines="none" className={styles.historyList}>
          {historyData.map((item) => {
            const randomId = Math.floor(Math.random() * 30) + 1;

            return (
              <IonItem key={item.id} className={styles.historyItem}>
                <IonAvatar slot="start" className={styles.avatar}>
                  <img src={`https://randomuser.me/api/portraits/${randomId - 1 % 2 == 0 ? "" : "wo"}men/${randomId}.jpg`} alt={item.name} />
                </IonAvatar>
                <IonLabel>
                  <h2 className={styles.contactName}>{item.name}</h2>
                  <div className={styles.callDetails}>
                    {getCallIcon(item.direction, item.status)}
                    <span className={styles.callTime}>
                      {item.date}, {item.time}
                    </span>
                  </div>
                </IonLabel>
              </IonItem>
            )
          }
          )}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default HistoryPage;