"use client"

import type React from "react"

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonPage,
  IonInput,
  IonFooter,
  IonAvatar,
} from "@ionic/react"
import { arrowBack, wifiOutline, camera, happy, send } from "ionicons/icons"
import { useState, useRef, useEffect } from "react"
import styles from "./ChatContact.module.css"
import { useHistory, useParams } from "react-router-dom"

interface Message {
  id: number
  text: string
  image?: string
  sent: boolean
  timestamp: Date
}

const ChatContact: React.FC = () => {
  const [newMessage, setNewMessage] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Lorem Ipsum is simply dummy text of the.",
      sent: true,
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: 2,
      text: "There are many variations of passages of Lorem Ipsum available, but the.",
      sent: true,
      timestamp: new Date(Date.now() - 1800000),
    },
    {
      id: 3,
      text: "Lorem Ipsum is simply dummy text of the",
      sent: false,
      timestamp: new Date(Date.now() - 900000),
    },
    {
      id: 4,
      text: "",
      image: "/placeholder.svg?height=180&width=300",
      sent: false,
      timestamp: new Date(Date.now() - 600000),
    },
  ])
  
  const history = useHistory()

  const contentRef = useRef<HTMLIonContentElement>(null)

  useEffect(() => {
    // Scroll to bottom when messages change
    if (contentRef.current) {
      contentRef.current.scrollToBottom(300)
    }
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const newMsg: Message = {
      id: messages.length + 1,
      text: newMessage,
      sent: true,
      timestamp: new Date(),
    }

    setMessages([...messages, newMsg])
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

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

      <IonContent ref={contentRef} className={styles.chatContent}>
        <div className={styles.messagesContainer}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.messageWrapper} ${message.sent ? styles.sent : styles.received}`}
            >
              <div className={styles.messageBubble}>
                {message.text && <p className={styles.messageText}>{message.text}</p>}
                {message.image && (
                  <div className={styles.imageContainer}>
                    <img
                      src={"imgs/LogoTopBar.png"}
                      alt="Message attachment"
                      className={styles.messageImage}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </IonContent>

      <IonFooter className={styles.chatFooter}>
        <div className={styles.inputContainer}>
          <button className={styles.cameraButton}>
            <IonIcon icon={camera} />
          </button>
          <IonInput
            placeholder="message"
            value={newMessage}
            onIonChange={(e) => setNewMessage(e.detail.value || "")}
            onKeyPress={handleKeyPress}
            className={styles.messageInput}
          />
          <button className={styles.emojiButton}>
            <IonIcon icon={happy} />
          </button>
          <button className={styles.sendButton} onClick={handleSendMessage}>
            <IonIcon icon={send} />
          </button>
        </div>
      </IonFooter>
    </IonPage>
  )
}

export default ChatContact

