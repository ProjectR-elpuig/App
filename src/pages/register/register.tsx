import type React from "react"
import { useState } from "react"
import { IonContent, IonPage, IonInput, IonButton, IonText } from "@ionic/react"
import { useHistory } from "react-router-dom"
import "./register.css"
import axios from "axios"

const Register: React.FC<{ changeToLogin: () => void }> = ({ changeToLogin }) => {
    const history = useHistory()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState<string | null>(null)

    const handleRegister = async () => {
        setError(null);

        // Validaciones básicas
        if (!username || !password || !confirmPassword) {
            setError("Por favor, completa todos los campos");
            return;
        }

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        try {
            const response = await axios.post('http://192.168.27.27:8080/api/auth/register', {
                username,
                password,
                phoneNumber: "" // Puedes añadir un campo para el número de teléfono si lo necesitas
            });

            // Guardar el token y redirigir
            localStorage.setItem('token', response.data.token);
            // onRegisterComplete();
            changeToLogin();
        } catch (err: any) {
            setError(err.response?.data?.error || err.message || "Error al crear la cuenta");
        }
    };

    const goBack = () => {
        changeToLogin();
    }

    return (
        <IonPage>
            <IonContent>
                <div className="register-container jersey-25-regular">
                    <img src="/imgs/logo.png" alt="V-Link Logo" className="logo" />
                    <h1 className="welcome-text">Join V-LINK</h1>

                    <div className="register-box">
                        <form className="register-form" onSubmit={(e) => e.preventDefault()}>
                            <h3>Username</h3>
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

                            <h3>Confirm Password</h3>
                            <IonInput
                                type="password"
                                value={confirmPassword}
                                placeholder="Confirm Password"
                                className="custom-input"
                                onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                            />

                            <IonButton onClick={handleRegister} expand="block" className="register-button">
                                REGISTER
                            </IonButton>
                        </form>

                        {error && (
                            <IonText color="danger" className="error-text">
                                {error}
                            </IonText>
                        )}

                        <p className="login-link">
                            ¿Ya tienes una cuenta?{" "}
                            <a onClick={goBack}>
                                Iniciar sesión
                            </a>
                        </p>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    )
}

export default Register