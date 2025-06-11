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
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const user = await getCurrentUser();
                    if (user) {
                        setUser(user);
                        setIsLoggedIn(true);
                    }
                } catch (error) {
                    console.error('Error checking authentication:', error);
                }
            }
            setLoading(false);
        };
        
        checkAuth();
    }, []);

    const handleLogin = async (userData) => {
        try {
            // Perform the login to get the token and user data
            const loginResponse = await login(userData);
            
            // The login function already updates localStorage with user and cart data
            // Just need to update the state
            const user = await getCurrentUser();
            console.log('Login - Fetched user data:', user);
            
            // Update the user state with fresh data
            setUser(user);
            setIsLoggedIn(true);
            
            // Get cart data from localStorage (already saved by login function)
            const cartData = JSON.parse(localStorage.getItem('cart') || '{}');
            
            // Dispatch cart data to Redux store
            if (cartData && Array.isArray(cartData.items)) {
                console.log('Dispatching cart data from localStorage:', cartData);
                dispatch(setCartFromLogin({
                    items: cartData.items,
                    total: cartData.total || 0
                }));
            } else {
                // If no cart data, initialize empty cart
                console.log('No cart data found, initializing empty cart');
                dispatch(setCartFromLogin({ items: [], total: 0 }));
            }
            
            return { ...loginResponse, user }; // Return the updated user data
        } catch (error) {
            console.error('Login error in AuthContext:', error);
            throw error;
        }
    };

    const handleRegister = async (userData) => {
        try {
            const response = await register(userData);
            if (response && response.user) {
                // Update user state
                setUser(response.user);
                
                // Handle cart data from registration if available
                if (response.cart) {
                    const cartData = {
                        items: response.cart.items || [],
                        total: response.cart.total || 0
                    };
                    dispatch(setCartFromLogin(cartData));
                }
                
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

    const handleLogout = async () => {
        try {
            // First, call the logout service
            const result = await logout();
            
            // Clear user state
            setUser(null);
            setIsLoggedIn(false);
            
            // Clear cart state in Redux
            dispatch(resetCart());
            
            // Clear any cart state
            window.dispatchEvent(new Event('storage'));
            
            // Clear any other context states that might exist
            window.dispatchEvent(new Event('authStateChanged'));
            
            return result;
        } catch (error) {
            console.error('Error during logout:', error);
            // Still clear local state even if server logout fails
            setUser(null);
            setIsLoggedIn(false);
            dispatch(resetCart());
            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new Event('authStateChanged'));
            
            return {
                success: false,
                message: error.message || 'Error during logout'
            };
        }
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
