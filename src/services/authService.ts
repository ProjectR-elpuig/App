import axios from 'axios';

const API_URL = 'http://143.47.38.69:5000'; // Cambia por la URL de tu backend
// const API_URL = 'http://localhost:5000'; // Cambia por la URL de tu backend

export interface LoginResponse {
  token: string;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    return response.data;
  } catch (error: any) {
    console.error('Error en el login:', error.response?.data || error.message);
    throw error.response?.data || { error: 'Error al iniciar sesión' };
  }
};

export const register = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/register`, { username, password });
    return response.data;
  } catch (error: any) {
    console.error('Error en el registro:', error.response?.data || error.message);
    throw error.response?.data || { error: 'Error al registrar usuario' };
  }
};
