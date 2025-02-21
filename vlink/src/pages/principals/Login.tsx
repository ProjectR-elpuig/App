import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonText,
  IonImg,
} from '@ionic/react';
import './Login.css';
import { login } from '../../services/authService'; // Importa el servicio de autenticación

const Login: React.FC<{ onLogin: (token: string) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // Para mostrar errores

  const handleLogin = async () => {
    // setError(null); // Reinicia el mensaje de error
    // try {
    //   const data = await login(username, password); // Llama al servicio de login
    //   localStorage.setItem('token', data.token); // Guarda el token en el almacenamiento local
    //   onLogin(data.token); // Notifica al componente padre que el usuario ha iniciado sesión
    // } catch (err: any) {
    //   setError(err.response?.data?.error || 'Error al iniciar sesión.');
    // }

    onLogin(''); // Elimina esta línea cuando implementes la autenticación
  };

  const authCfx = () => {
    // Aquí puedes implementar la autenticación con CFX
    onLogin('');
  };

  const authDiscord = () => {
    // Aquí puedes implementar la autenticación con Discord
    onLogin('');
  };

  return (
    <IonPage>
      <IonContent>
        <div className="login-container jersey-25-regular">
          <img src="/imgs/logo.png" alt="V-Link Logo" className="logo" />
          <h1 className="welcome-text">Welcome to V-LINK</h1>
          
          <div className="login-box">
            <h2>Login With</h2>
            
            <div className="oauth-buttons">
              <IonButton onClick={authCfx} className="cfx-button" expand="block">
                <img src="/imgs/cfx-logo.png" alt="CFX" />
              </IonButton>
              
              <IonButton onClick={authDiscord} className="discord-button" expand="block">
                <img src="/imgs/discord-logo2.png" alt="Discord" />
              </IonButton>
            </div>

            <div className="divider">
              <span>OR</span>
            </div>

            <form className="login-form" onSubmit={(e) => e.preventDefault()}>
              <h3>Login</h3>
              <IonInput
                type="text"
                value={username}
                placeholder="Username"
                className="custom-input"
                onIonChange={(e) => setUsername(e.detail.value!)}
              />
              <h3>Password</h3>
              <IonInput
                type="password"
                value={password}
                placeholder="Password"
                className="custom-input"
                onIonChange={(e) => setPassword(e.detail.value!)}
              />
              
              <IonButton onClick={handleLogin} expand="block" className="login-button">
                Login
              </IonButton>
            </form>

            {error && <IonText color="danger" className="error-text">{error}</IonText>}

            <p className="create-account">
              Join discord to create account!
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
