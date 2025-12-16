import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await api.post('/auth/login', { username, password });
            const { token, user: userData } = response.data;

            // Store token and user
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);
            setIsAuthenticated(true);

            return userData.role;
        } catch (error) {
            const message = error.response?.data?.error || 'Login failed';
            throw new Error(message);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
