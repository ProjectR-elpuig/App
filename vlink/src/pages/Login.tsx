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

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    onLogin();
    // console.log('login he llegado', username, password);
    // if (username === 'adm' && password === 'adm') {
    //   onLogin(); // Llamar a la función del padre para actualizar el estado
    // } else {
    //   alert('Usuario o contraseña incorrectos');
    // }
  };

  const authCfx = () => {
    onLogin();
  };

  const authDiscord = () => {
    onLogin();
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
                <img src="/imgs/cfx-logo.png" alt="CFX"/>
              </IonButton>
              
              <IonButton onClick={authDiscord} className="discord-button" expand="block">
                <img src="/imgs/discord-logo.png" alt="Discord" />
              </IonButton>
            </div>

            <div className="divider">
              <span>OR</span>
            </div>

            
            <form className="login-form">
              <h3>Login</h3>
              <IonInput
                type="text"
                value={username}
                placeholder="username"
                className="custom-input"
                onIonChange={(e) => setUsername(e.detail.value!)}
              />
              <h3>Password</h3>
              <IonInput
                type="password"
                value={password}
                placeholder="password"
                className="custom-input"
                onIonChange={(e) => setPassword(e.detail.value!)}
              />
              
              <IonButton onClick={handleLogin} expand="block" className="login-button">
                Login
              </IonButton>
            </form>

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