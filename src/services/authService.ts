import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth'; // Nueva URL base del backend

export interface LoginResponse {
  token: string;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    console.log('Intentando iniciar sesión con:', { username, password });
    const response = await axios.post(`${API_URL}/login`, { 
      username, 
      password 
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error en el login:', error.response?.data || error.message);
    throw error.response?.data || { error: error.message || 'Error al iniciar sesión' };
  }
};

export const register = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/register`, { 
      username, 
      password 
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error en el registro:', error.response?.data || error.message);
    throw error.response?.data || { error: 'Error al registrar usuario' };
  }
};