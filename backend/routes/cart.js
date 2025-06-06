const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const jwt = require('jsonwebtoken');

// Authentication middleware
const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Apply auth middleware to all cart routes
router.use(auth);

// Add item to cart
router.post('/add', async (req, res) => {
    try {
        const { userId, product } = req.body;
        
        // Safely get or create cart for this user
        const cart = await Cart.getOrCreate(userId);
        if (!cart) {
            return res.status(500).json({ 
                message: 'Failed to get or create cart' 
            });
        }
        
        // Add or update product
        const existingItem = cart.items.find(item => item.productId === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({
                productId: product.id,
                productName: product.name,
                quantity: 1,
                price: product.price
            });
        }
        
        // Update total
        cart.total = cart.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        
        await cart.save();
        res.json(cart);
    } catch (error) {
        console.error('Error in cart add:', error);
        res.status(500).json({ 
            message: error.message || 'Error adding item to cart' 
        });
    }
});

// Update entire cart
router.put('/update/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { items } = req.body;
        
        // Verify the user is updating their own cart
        if (req.user.userId !== userId) {
            return res.status(403).json({ message: 'Not authorized to update this cart' });
        }
        
        // Safely get or create cart for this user
        const cartDoc = await Cart.getOrCreate(userId);
        if (!cartDoc) {
            return res.status(500).json({ 
                message: 'Failed to get or create cart' 
            });
        }
        
        // Update cart items with the new structure
        cartDoc.items = items.map(item => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            price: item.price
        }));
        
        // Recalculate total
        cartDoc.total = cartDoc.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        
        await cartDoc.save();
        res.json({
            message: 'Cart updated successfully',
            cart: cartDoc
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get cart items
router.get('/items/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove item from cart
router.delete('/remove/:userId/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const cart = await Cart.findOne({ userId });
        
        if (cart) {
            cart.items = cart.items.filter(item => item.productId !== productId);
            await cart.save();
            res.json(cart);
        } else {
            res.json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;