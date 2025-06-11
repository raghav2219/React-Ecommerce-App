const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Cart = require('../models/Cart');
const jwt = require('jsonwebtoken');

// Register user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, username } = req.body;
        
        // Validate required fields
        if (!name || !email || !password || !username) {
            return res.status(400).json({ 
                message: 'All fields (name, email, password, username) are required' 
            });
        }

        // Check if user already exists by email or username
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        if (existingUser) {
            return res.status(400).json({ 
                message: 'Email or username already registered' 
            });
        }

        // Create new user
        const user = new User({ 
            name, 
            email, 
            password,
            username
        });
        await user.save();

        // Create JWT token with isAdmin flag
        const token = jwt.sign(
            { 
                userId: user._id, 
                email: user.email,
                isAdmin: user.isAdmin || false
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Get user's cart
        const cart = await Cart.findOne({ userId: user._id });

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin || false,
                cartId: user.cartId
            },
            cart: cart ? {
                id: cart._id,
                items: cart.items,
                total: cart.total
            } : null
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create JWT token with isAdmin flag
        const token = jwt.sign(
            { 
                userId: user._id, 
                email: user.email,
                isAdmin: user.isAdmin || false
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Get user's cart
        const cart = await Cart.findOne({ userId: user._id });
        
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin || false,
                cartId: user.cartId
            },
            cart: cart ? {
                id: cart._id,
                items: cart.items,
                total: cart.total
            } : {
                id: null,
                items: [],
                total: 0
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Verify token middleware
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Get current user data
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({ 
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin || false,
                cartId: user.cartId
            }
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user profile (protected route)
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Remove sensitive data before sending user data
        const userData = user.toObject();
        delete userData.password;
        
        res.json({
            ...userData,
            isAdmin: user.isAdmin || false
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Logout user
router.post('/logout', verifyToken, async (req, res) => {
    try {
        // Get userId from token first, fallback to request body
        const userId = req.user?.userId || req.body?.userId;
        
        if (!userId) {
            console.warn('No userId provided for logout');
            return res.json({ 
                success: true,
                message: 'Logged out (no user ID provided)' 
            });
        }
        
        // Just log the logout, don't clear the cart
        console.log(`User ${userId} logged out successfully (cart preserved)`);
        
        res.json({ 
            success: true,
            message: 'Logged out successfully' 
        });
    } catch (error) {
        console.error('Logout error:', error);
        // Still return success since the client will clear local data anyway
        res.json({ 
            success: true,
            message: 'Logged out (server error but local data cleared)'
        });
    }
});

module.exports = router;
