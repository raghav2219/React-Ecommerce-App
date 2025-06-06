const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    items: [{
        productId: {
            type: String,
            required: true
        },
        productName: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    total: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add static methods to the schema
cartSchema.statics.getOrCreate = async function(userId) {
    try {
        // First try to find the cart
        const cart = await this.findOne({ userId });
        
        if (cart) {
            return cart;
        }

        // If no cart exists, create a new one
        const newCart = new this({
            userId,
            items: [],
            total: 0
        });

        // Save the new cart
        const savedCart = await newCart.save();
        return savedCart;
    } catch (error) {
        console.error('Error in Cart.getOrCreate:', error);
        throw error;
    }
};

module.exports = mongoose.model('Cart', cartSchema);