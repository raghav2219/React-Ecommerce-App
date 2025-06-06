const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

async function fixCartLinks() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        
        // Get all users
        console.log('Getting all users...');
        const users = await db.collection('users').find({}).toArray();
        console.log(`Found ${users.length} users`);
        
        // Process each user
        for (const user of users) {
            console.log(`\nProcessing user: ${user._id}`);
            
            // Find all carts for this user
            const carts = await db.collection('carts').find({ userId: user._id }).toArray();
            console.log(`Found ${carts.length} carts for user`);
            
            if (carts.length === 0) {
                console.log('No carts found, creating new one...');
                // Create new cart for user
                const cart = await db.collection('carts').insertOne({
                    userId: user._id,
                    items: [],
                    total: 0,
                    createdAt: new Date()
                });
                console.log('Created new cart:', cart.insertedId);
                
                // Update user's cartId
                await db.collection('users').updateOne(
                    { _id: user._id },
                    { $set: { cartId: cart.insertedId } }
                );
            } else if (carts.length > 1) {
                console.log('Multiple carts found, fixing...');
                
                // Sort carts by creation date (oldest first)
                const sortedCarts = [...carts].sort((a, b) => 
                    new Date(a.createdAt) - new Date(b.createdAt)
                );
                
                // Keep the oldest cart
                const keepCart = sortedCarts[0];
                console.log(`Keeping cart: ${keepCart._id} created at: ${keepCart.createdAt}`);
                
                // Delete all newer carts
                const deleteIds = sortedCarts.slice(1).map(cart => cart._id);
                if (deleteIds.length > 0) {
                    const result = await db.collection('carts').deleteMany({
                        _id: { $in: deleteIds }
                    });
                    console.log(`Deleted ${result.deletedCount} duplicate carts`);
                }
                
                // Update user's cartId if needed
                if (user.cartId !== keepCart._id) {
                    console.log('Updating user cart reference...');
                    await db.collection('users').updateOne(
                        { _id: user._id },
                        { $set: { cartId: keepCart._id } }
                    );
                }
            } else {
                console.log('Single cart found, checking references...');
                
                // Ensure user's cartId matches the cart
                if (user.cartId !== carts[0]._id) {
                    console.log('Updating user cart reference...');
                    await db.collection('users').updateOne(
                        { _id: user._id },
                        { $set: { cartId: carts[0]._id } }
                    );
                }
            }
        }
        
        console.log('\nCleanup complete!');
        console.log('Final statistics:');
        
        // Get final counts
        const userCount = await db.collection('users').countDocuments();
        const cartCount = await db.collection('carts').countDocuments();
        
        console.log(`Total users: ${userCount}`);
        console.log(`Total carts: ${cartCount}`);
        
    } catch (error) {
        console.error('Error during cleanup:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

// Run the cleanup
fixCartLinks();
