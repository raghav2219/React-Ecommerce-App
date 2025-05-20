const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Add item to cart
router.post('/add', async (req, res) => {
    try {
        const { userId, product } = req.body;
        
        // Find or create cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId });
        }
        
        // Add or update product
        const existingItem = cart.items.find(item => item.productId === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({
                productId: product.id,
                quantity: 1,
                price: product.price
            });
        }
        
        // Update total
        cart.total = cart.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update entire cart
router.put('/update/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { cart } = req.body;
        
        // Find or create cart
        let cartDoc = await Cart.findOne({ userId });
        if (!cartDoc) {
            cartDoc = new Cart({ userId });
        }
        
        // Update cart items
        cartDoc.items = cart.map(item => ({
            productId: item.id,
            quantity: item.qty,
            price: item.price
        }));
        
        // Update total
        cartDoc.total = cart.reduce((sum, item) => sum + (item.qty * item.price), 0);
        
        await cartDoc.save();
        res.json(cartDoc);
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