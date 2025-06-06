import React, { createContext, useContext, useState, useEffect } from 'react';
import { register, login, logout, getCurrentUser, isAuthenticated } from '../services/authService';
import { useDispatch } from 'react-redux';
import { setCartFromLogin, resetCart } from '../redux/reducer/handleCart';

// Create a custom hook to use dispatch
const useCartDispatch = () => {
    const dispatch = useDispatch();
    return dispatch;
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getCurrentUser());
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const dispatch = useCartDispatch();

    useEffect(() => {
        // Check if user is already logged in
        const token = localStorage.getItem('token');
        if (token) {
            const user = getCurrentUser();
            if (user) {
                setUser(user);
                setIsLoggedIn(true);
            }
        }
        setLoading(false);
    }, []);

    const handleLogin = async (userData) => {
        try {
            const response = await login(userData);
            setUser(response.user);
            setIsLoggedIn(true);
            
            // Dispatch cart data to Redux store
            if (response.cart) {
                console.log('Dispatching cart data:', response.cart);
                dispatch(setCartFromLogin({
                    items: Array.isArray(response.cart.items) ? response.cart.items : [],
                    total: response.cart.total || 0
                }));
            } else {
                // If no cart data, ensure we clear any existing cart
                dispatch(setCartFromLogin([]));
            }
            
            return response;
        } catch (error) {
            throw error;
        }
    };

    const handleRegister = async (userData) => {
        try {
            const response = await register(userData);
            if (response && response.user) {
                setUser(response.user);
                return response;
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('AuthContext: Registration error:', {
                message: error.message,
                response: error.response,
                status: error.response?.status
            });
            throw error;
        }
    };

    const handleLogout = () => {
        // Clear user state
        setUser(null);
        setIsLoggedIn(false);
        
        // Clear cart state in Redux
        dispatch(resetCart());
        
        // Clear any cart state
        window.dispatchEvent(new Event('storage'));
        
        // Clear any other context states that might exist
        window.dispatchEvent(new Event('authStateChanged'));
        
        // Call the logout service
        logout();
    };

    const value = {
        user,
        isLoggedIn,
        loading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        isAuthenticated
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
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
