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
                message: 'Email already registered' 
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

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
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
                cartId: user.cartId
            },
            cart: cart ? {
                id: cart._id,
                items: cart.items,
                total: cart.total
            } : null
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
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

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
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
        res.status(500).json({ error: error.message });
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
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Get user profile (protected route)
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Logout user
router.post('/logout', verifyToken, async (req, res) => {
    try {
        // Clear any session data
        req.session.destroy();
        
        // Clear cart data for this user
        const cart = await Cart.findOne({ userId: req.user.userId });
        if (cart) {
            cart.items = [];
            cart.total = 0;
            await cart.save();
        }
        
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
