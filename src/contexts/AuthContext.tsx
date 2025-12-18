import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: number;
    email: string;
    name: string;
    company?: string;
    role: 'warehouse' | 'dealer';
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string, company: string, role: 'warehouse' | 'dealer') => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:3001/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    const response = await fetch(`${API_URL}/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${storedToken}`
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setUser(data.user);
                        setToken(storedToken);
                    } else {
                        localStorage.removeItem('token');
                        setToken(null);
                    }
                } catch (error) {
                    console.error('Auth init error:', error);
                    localStorage.removeItem('token');
                    setToken(null);
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
        }

        const data = await response.json();
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.token);
    };

    const register = async (email: string, password: string, name: string, company: string, role: 'warehouse' | 'dealer') => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name, company, role })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Registration failed');
        }

        // Auto-login after registration
        await login(email, password);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            register,
            logout,
            isAuthenticated: !!user,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
