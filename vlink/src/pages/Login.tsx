import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonButton, IonLabel, IonItem, IonHeader, IonToolbar, IonTitle, IonToast } from '@ionic/react';
import './Login.css'; // Estilos personalizados si los necesitas

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = () => {
    // Validación simple (puedes reemplazar con lógica real)
    console.log('Login realizado: ' + username + " " + password);
    if (username === 'adm' && password === 'adm') {
      setMessage('¡Inicio de sesión exitoso!');
      setShowToast(true);
      onLogin(); // Llamar al callback cuando el login es exitoso
    } else {
      // alert('Credenciales inválidas');
      setMessage('Usuario o contraseña incorrecto.');
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonContent className='loginContainer' >
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

        {/* Notificacion */}
        <IonToast
          isOpen={showToast}
          message={message}
          duration={2000}
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
