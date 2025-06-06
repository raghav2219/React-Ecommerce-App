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

        // Store user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('cart', JSON.stringify(response.data.cart || {}));
        
        // Log successful login
        console.log('authService: Login successful:', {
            userId: response.data.user._id,
            userName: response.data.user.name,
            userEmail: response.data.user.email
        });
        
        return response.data;
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

export const logout = async () => {
    try {
        // Make request to backend to clear session and cart
        const token = localStorage.getItem('token');
        if (token) {
            await axios.post(`${API_URL}/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

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
    } catch (error) {
        console.error('Error during logout:', error);
        // Still clear local data even if backend request fails
        localStorage.clear();
        sessionStorage.clear();
        window.dispatchEvent(new Event('storage'));
    }
};

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
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
