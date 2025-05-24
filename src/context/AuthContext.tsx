import React, { createContext, useContext, useState, useEffect } from 'react';
import { Storage } from '@ionic/storage';

interface UserData {
    citizenid: string;
    token: string;
    phoneNumber: string;
}

interface AuthContextType {
    user: UserData | null;
    login: (citizenid: string, token: string, phoneNumber: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [store, setStore] = useState<Storage | null>(null);

    useEffect(() => {
        const initStorage = async () => {
            const storage = new Storage();
            await storage.create();
            setStore(storage);

            // Recuperar datos del usuario al iniciar
            const storedUser = await storage.get('user');
            if (storedUser) {
                setUser(storedUser);
            }
        };

        initStorage();
    }, []);

    // Cambiamos el parámetro username por citizenid
    const login = async (citizenid: string, token: string, phoneNumber: string) => {
        const userData = { citizenid, token, phoneNumber };
        setUser(userData);
        if (store) {
            await store.set('user', userData);
        }
    };

    const logout = async () => {
        setUser(null);
        if (store) {
            await store.remove('user');
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);