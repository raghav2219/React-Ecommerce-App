const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
//const Cart = require('../models/Cart');

// Try to import Order model, but don't fail if it doesn't exist yet
let Order;
try {
    Order = require('../models/Order');
} catch (error) {
    console.warn('Order model not found. Some admin features may be limited.');
}

// Admin middleware
const isAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Fetch the latest user data from the database
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user is admin
        if (!user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }

        // Attach the full user object to the request
        req.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        };
        
        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token is not valid' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Apply isAdmin middleware to all admin routes
router.use(isAdmin);

// Get all users (Admin only)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user by ID (Admin only)
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user (Admin only)
router.put('/users/:id', async (req, res) => {
    try {
        const { name, email, isActive, isAdmin } = req.body;
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        if (typeof isActive !== 'undefined') user.isActive = isActive;
        if (typeof isAdmin !== 'undefined') user.isAdmin = isAdmin;
        
        await user.save();
        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete user (Admin only)
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        await user.remove();
        res.json({ message: 'User removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all orders (Admin only)
router.get('/orders', async (req, res) => {
    if (!Order) {
        return res.status(404).json({ message: 'Order model not available' });
    }
    
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update order status (Admin only)
router.put('/orders/:id', async (req, res) => {
    if (!Order) {
        return res.status(404).json({ message: 'Order model not available' });
    }
    
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        order.status = status;
        await order.save();
        
        res.json({ message: 'Order status updated', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get dashboard stats (Admin only)
router.get('/stats', async (req, res) => {
    try {
        const stats = {
            totalUsers: 0,
            totalOrders: 0,
            totalRevenue: 0,
            recentOrders: []
        };

        // Get user count
        stats.totalUsers = await User.countDocuments();

        // Get order stats if Order model is available
        if (Order) {
            const [totalOrders, totalRevenue, recentOrders] = await Promise.all([
                Order.countDocuments(),
                Order.aggregate([
                    { $match: { status: 'completed' } },
                    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
                ]),
                Order.find()
                    .sort({ createdAt: -1 })
                    .limit(5)
                    .populate('user', 'name')
            ]);

            stats.totalOrders = totalOrders;
            stats.totalRevenue = totalRevenue[0]?.total || 0;
            stats.recentOrders = recentOrders;
        }

        res.json({ stats });
    } catch (error) {
        console.error('Error in /admin/stats:', error);
        res.status(500).json({ 
            message: 'Error fetching dashboard stats',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;
