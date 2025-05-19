// En cualquier servicio obtener datos del usuario
import { useAuth } from '../context/AuthContext';

export const someService = () => {
  const { user } = useAuth();
  
  const fetchData = async () => {
    if (!user?.token) return;
    
    const response = await fetch('https://api.example.com/data', {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });
    // ...
  };
};




// Obtener datos del usuario en servicios que no son componentes como: src/services/auth.ts
import { Storage } from '@ionic/storage';

let store: Storage | null = null;

const initStorage = async () => {
  store = new Storage();
  await store.create();
};

export const getAuthToken = async (): Promise<string | null> => {
  if (!store) await initStorage();
  const user = await store?.get('user');
  return user?.token || null;
};