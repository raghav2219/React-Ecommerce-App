import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const register = async (userData) => {
    try {
        // Ensure we have all required fields
        const { name, email, password } = userData;
        if (!name || !email || !password) {
            throw new Error('All fields (name, email, password) are required');
        }

        // Create username from email (first part before @)
        const username = email.split('@')[0];
        
        console.log('authService: Attempting to register with:', { name, email, username });
        const response = await axios.post(`${API_URL}/register`, { 
            name, 
            email, 
            password,
            username
        });
        
        // Log response for debugging
        console.log('authService: Registration response:', {
            status: response.status,
            statusText: response.statusText,
            data: {
                token: '[TOKEN_RECEIVED]',
                user: '[USER_DATA_RECEIVED]',
                cart: '[CART_DATA_RECEIVED]'
            }
        });

        // Store the token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('cart', JSON.stringify(response.data.cart || {}));
        
        return response.data;
    } catch (error) {
        // Handle different types of errors
        if (error.response) {
            // Server responded with an error
            const errorData = error.response.data;
            console.error('authService: Server error:', errorData);
            throw new Error(errorData.message || 'Registration failed');
        } else if (error.request) {
            // Request made but no response
            console.error('authService: Network error:', error.message);
            throw new Error('Network error. Please try again later.');
        } else {
            // Something happened in setting up the request
            console.error('authService: Request error:', error.message);
            throw new Error('Error occurred during registration');
        }
    }
};

export const login = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, userData);
        
        // Validate response
        if (!response.data || !response.data.token || !response.data.user) {
            throw new Error('Invalid response from server');
        }

        // Ensure isAdmin is set
        const userWithAdmin = {
            ...response.data.user,
            isAdmin: Boolean(response.data.user.isAdmin)
        };

        // Store user data with isAdmin
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(userWithAdmin));
        
        // Store cart data if available
        if (response.data.cart && response.data.cart.items) {
            const cartData = {
                items: response.data.cart.items.map(item => ({
                    id: item.productId || item._id,
                    title: item.productName || 'Product',
                    price: item.price || 0,
                    qty: item.quantity || 1,
                    image: item.image
                })),
                total: response.data.cart.total || 0
            };
            localStorage.setItem('cart', JSON.stringify(cartData));
        } else {
            // Initialize empty cart if none exists
            localStorage.setItem('cart', JSON.stringify({ items: [], total: 0 }));
        }
        
        // Log successful login
        console.log('authService: Login successful:', {
            userId: userWithAdmin._id || userWithAdmin.id,
            userName: userWithAdmin.name,
            userEmail: userWithAdmin.email,
            isAdmin: userWithAdmin.isAdmin,
            cartItems: response.data.cart?.items?.length || 0
        });
        
        // Return user data with isAdmin and cart
        return {
            ...response.data,
            user: userWithAdmin,
            cart: response.data.cart || { items: [], total: 0 }
        };
    } catch (error) {
        // Handle different types of errors
        if (error.response) {
            // Server responded with an error
            const errorData = error.response.data;
            console.error('authService: Login failed:', {
                status: error.response.status,
                message: errorData.message || 'Login failed'
            });
            throw new Error(errorData.message || 'Login failed');
        } else if (error.request) {
            // Request made but no response
            console.error('authService: Network error:', error.message);
            throw new Error('Network error. Please try again later.');
        } else {
            // Something happened in setting up the request
            console.error('authService: Request error:', error.message);
            throw new Error('Error occurred during login');
        }
    }
};

/**
 * Logs out the current user by making a request to the server and clearing local data
 * @returns {Promise<{success: boolean, message: string}>} Result of the logout operation
 */
export const logout = async () => {
    const clearLocalData = () => {
        // Clear all user-related data from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userProfile');
        
        // Clear any other user-related data that might exist
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('user_') || key.startsWith('auth_')) {
                localStorage.removeItem(key);
            }
        });
        
        // Clear any session data
        sessionStorage.clear();

        // Dispatch storage event to notify components
        window.dispatchEvent(new Event('storage'));
    };

    try {
        const token = localStorage.getItem('token');
        
        // Clear local data first to ensure UI updates immediately
        const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
        clearLocalData();
        
        if (!token) {
            console.log('No token found, cleared local data only');
            return { success: true, message: 'Local data cleared' };
        }

        try {
            // Make the API call to logout - don't await it to make logout faster
            axios.post(
                `${API_URL}/logout`,
                { userId }, // Send userId to clear cart on server
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            ).catch(err => {
                console.error('Logout API call failed, but continuing:', err.message);
            });
            
            return { 
                success: true, 
                message: 'Logging out...' 
            };
        } catch (error) {
            console.error('Error during logout API call:', error.message);
            // Still return success since we've cleared local data
            return { 
                success: true, 
                message: 'Logged out (local data cleared)' 
            };
        }
    } catch (error) {
        console.error('Error during logout:', error);
        // Clear local data even if something else fails
        try {
            clearLocalData();
        } catch (clearError) {
            console.error('Error clearing local data during logout:', clearError);
        }
        
        // Return success since we've cleared local data
        return { 
            success: true, 
            message: 'Logged out (local data cleared)'
        };
    }
};

export const getCurrentUser = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;

        // Get user data from localStorage first
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            // Ensure isAdmin is a boolean
            user.isAdmin = Boolean(user.isAdmin);
            return user;
        }

        // If no user in localStorage, fetch from server
        const response = await axios.get(`${API_URL}/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.data && response.data.user) {
            // Ensure isAdmin is a boolean
            const user = {
                ...response.data.user,
                isAdmin: Boolean(response.data.user.isAdmin)
            };
            
            // Save to localStorage for future use
            localStorage.setItem('user', JSON.stringify(user));
            
            // Update cart data if available
            if (response.data.cart) {
                const cartData = {
                    items: response.data.cart.items || [],
                    total: response.data.cart.total || 0
                };
                localStorage.setItem('cart', JSON.stringify(cartData));
            }
            
            return user;
        }
        
        return null;
    } catch (error) {
        console.error('Error getting current user:', error);
        // Clear invalid token if there's an error
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('cart');
        }
        return null;
    }
};

export const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
};

// Add token to axios requests for authenticated requests
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('authService: Added token to request headers');
        } else {
            console.log('authService: No token available for request');
        }
        return config;
    },
    error => {
        console.error('authService: Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
axios.interceptors.response.use(
    response => {
        console.log('authService: Received response:', {
            status: response.status,
            statusText: response.statusText,
            url: response.config.url,
            method: response.config.method
        });
        return response;
    },
    error => {
        console.error('authService: Response error:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
            method: error.config?.method,
            data: error.response?.data
        });
        return Promise.reject(error);
    }
);
