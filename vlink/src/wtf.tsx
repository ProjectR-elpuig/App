import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonButton, IonLabel, IonItem, IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import './Login.css'; // Estilos personalizados si los necesitas

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Validación simple (puedes reemplazar con lógica real)
    if (username === 'user' && password === 'password') {
      onLogin(); // Llamar al callback cuando el login es exitoso
    } else {
      alert('Credenciales inválidas');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Iniciar Sesión</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Usuario</IonLabel>
          <IonInput
            type="text"
            value={username}
            onIonChange={(e) => setUsername(e.detail.value!)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Contraseña</IonLabel>
          <IonInput
            type="password"
            value={password}
            onIonChange={(e) => setPassword(e.detail.value!)}
          />
        </IonItem>
        <IonButton expand="full" onClick={handleLogin} className="ion-margin-top">
          Iniciar Sesión
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;
