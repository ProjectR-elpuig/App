import React, { createContext, useContext, useState, useEffect } from 'react';
import { Storage } from '@ionic/storage';

interface UserData {
    username: string;
    token: string;
}

interface AuthContextType {
    user: UserData | null;
    login: (username: string, token: string) => Promise<void>;
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

    const login = async (username: string, token: string) => {
        const userData = { username, token };
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