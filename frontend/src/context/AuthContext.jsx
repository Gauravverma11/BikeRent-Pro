import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const syncUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await api.get('/users/me');
                    setUser(res.data.data.user);
                    localStorage.setItem('user', JSON.stringify(res.data.data.user));
                } catch (err) {
                    console.error('Failed to sync user:', err);
                    // If token is invalid, logout
                    if (err.response?.status === 401) {
                        logout();
                    }
                }
            }
            setLoading(false);
        };

        const storedUser = localStorage.getItem('user');
        if (storedUser && storedUser !== 'undefined') {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                localStorage.removeItem('user');
            }
        }
        syncUser();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        const { token, data } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
    };

    const requestSignupOTP = async (name, email) => {
        return await api.post('/auth/request-signup-otp', { name, email });
    };

    const verifySignupOTP = async (email, otp) => {
        return await api.post('/auth/verify-signup-otp', { email, otp });
    };

    const signup = async (userData) => {
        const res = await api.post('/auth/signup', userData);
        const { token, data } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const updateUser = (updatedUser) => {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser, requestSignupOTP, verifySignupOTP }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
