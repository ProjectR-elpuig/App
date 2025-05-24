import type React from "react"
import { useState } from "react"
import { IonContent, IonPage, IonInput, IonButton, IonText, IonRouterLink } from "@ionic/react"
import "./Login.css"
import { loginService } from '../../services/authService'; // Importa el servicio de autenticación
import { useAuth } from '../../context/AuthContext';

const Login: React.FC<{ changeToRegister: () => void }> = ({ changeToRegister }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null) // Para mostrar errores
  const { login } = useAuth();

  const handleLogin = async () => {
    setError(null);
    try {
      const data = await loginService(username, password); // Llama al servicio de login
      console.log('User:', data?.usuario?.citizenId, JSON.stringify(data));
      await login(data.usuario.citizenId, data.token, data.usuario.phoneNumber); // Usa el contexto para guardar los datos
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error al iniciar sesión');
    }
  };

  // const authCfx = () => {
  //   // Aquí puedes implementar la autenticación con CFX
  //   onLogin("")
  // }

  // const authDiscord = () => {
  //   // Aquí puedes implementar la autenticación con Discord
  //   onLogin("")
  // }

  return (
    <IonPage>
      <IonContent>
        <div className="login-container jersey-25-regular">
          <img src="/imgs/logo.png" alt="V-Link Logo" className="logo" />
          <h1 className="welcome-text">Welcome to V-LINK</h1>

          <div className="login-box">
            {/* Login con Discord & CFX */}
            {/* <h2>Login With</h2>
            
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
            </div> */}

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

            {error && (
              <IonText color="danger" className="error-text">
                {error}
              </IonText>
            )}

            <div className="account-actions">
              <p className="create-account">¿Aún no tienes cuenta? <a onClick={changeToRegister}>Crear cuenta</a></p>
              {/* <IonButton expand="block" className="register-button" onClick={changeToRegister}>
                REGISTER
              </IonButton> */}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Login