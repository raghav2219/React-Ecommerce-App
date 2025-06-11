const express = require('express');
const connectDB = require('./config/db');
const cartRoutes = require('./routes/cart');
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// JWT middleware
app.use((req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        } catch (error) {
            console.log('Invalid token');
        }
    }
    next();
});

// Routes
app.use('/api/cart', cartRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
