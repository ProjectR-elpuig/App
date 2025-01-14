import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonText,
  IonImg,
} from '@ionic/react';
import './Login.css';

const Login: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="login-container">
          <img src="/logo.png" alt="V-Link Logo" className="logo" />
          <h1 className="welcome-text">Welcome to V-LINK</h1>
          
          <div className="login-box">
            <h2>Login With</h2>
            
            <div className="oauth-buttons">
              <IonButton className="cfx-button" expand="block">
                <img src="/cfx-logo.png" alt="CFX"/>
              </IonButton>
              
              <IonButton className="discord-button" expand="block">
                <img src="/discord-logo.png" alt="Discord" />
              </IonButton>
            </div>

            <div className="divider">
              <span>OR</span>
            </div>

            <h3>Login</h3>
            
            <form className="login-form">
              <IonInput
                type="text"
                placeholder="username"
                className="custom-input"
              />
              <h3>Password</h3>
              <IonInput
                type="password"
                placeholder="password"
                className="custom-input"
              />
              
              <IonButton expand="block" className="login-button">
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