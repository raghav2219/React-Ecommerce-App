const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

async function cleanupAllCarts() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Get ALL carts
    console.log('Looking for ALL carts...');
    const carts = await db.collection('carts').find({}).toArray();
    console.log(`Found ${carts.length} total carts`);
    
    if (carts.length === 0) {
      console.log('No carts found to clean up');
      return;
    }

    // Group carts by userId and keep only the oldest one for each user
    const cartsByUser = {};
    
    // First pass: Group carts and find the oldest one for each user
    for (const cart of carts) {
      const userId = cart.userId;
      if (!userId) continue;
      
      if (!cartsByUser[userId]) {
        cartsByUser[userId] = { oldest: cart, count: 1 };
      } else {
        cartsByUser[userId].count++;
        if (new Date(cart.createdAt) < new Date(cartsByUser[userId].oldest.createdAt)) {
          cartsByUser[userId].oldest = cart;
        }
      }
    }

    // Second pass: Delete all but the oldest cart for each user
    for (const [userId, data] of Object.entries(cartsByUser)) {
      if (data.count <= 1) continue; // Skip if only one cart
      
      console.log(`\nProcessing user ${userId} with ${data.count} carts`);
      console.log(`Keeping cart: ${data.oldest._id} created at: ${data.oldest.createdAt}`);
      
      // Get all carts for this user except the oldest one
      const cartsToDelete = await db.collection('carts').find({
        userId,
        _id: { $ne: data.oldest._id }
      }).toArray();
      
      if (cartsToDelete.length > 0) {
        const deleteIds = cartsToDelete.map(cart => cart._id);
        const result = await db.collection('carts').deleteMany({
          _id: { $in: deleteIds }
        });
        console.log(`Deleted ${result.deletedCount} duplicate carts`);
      }
      
      // Update user's cart reference
      await db.collection('users').updateOne(
        { _id: new mongoose.Types.ObjectId(userId) },
        { $set: { cartId: new mongoose.Types.ObjectId(data.oldest._id) } }
      );
    }
    
    console.log('\nCleanup complete!');
    console.log(`Total carts remaining: ${await db.collection('carts').countDocuments()}`);
    
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

// Run the cleanup
cleanupAllCarts();
