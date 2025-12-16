import { createContext, useContext, useState, useEffect } from 'react';

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

    // Load user from sessionStorage on mount
    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setIsAuthenticated(true);
        }
    }, []);

    const login = (username, password) => {
        // Fake authentication logic
        // Username and password must match
        if (username !== password) {
            throw new Error('Invalid credentials');
        }

        let role = null;

        // Check credentials
        if (username === 'tenant123') {
            role = 'tenant';
        } else if (username === 'admin') {
            role = 'landlord';
        } else {
            throw new Error('Invalid credentials');
        }

        const userData = { username, role };
        setUser(userData);
        setIsAuthenticated(true);
        sessionStorage.setItem('user', JSON.stringify(userData));

        return role;
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        sessionStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
