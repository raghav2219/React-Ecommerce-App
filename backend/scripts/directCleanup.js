const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

async function cleanupDuplicateCarts() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Get the raw MongoDB driver
    const db = mongoose.connection.db;
    
    // Get all carts
    const carts = await db.collection('carts').find({}).toArray();
    console.log(`Found ${carts.length} carts in total`);
    
    // Group carts by userId
    const cartsByUser = {};
    carts.forEach(cart => {
      const userId = cart.userId ? cart.userId.toString() : 'no-user';
      if (!cartsByUser[userId]) {
        cartsByUser[userId] = [];
      }
      cartsByUser[userId].push(cart);
    });
    
    let totalDeleted = 0;
    
    // Process each user's carts
    for (const [userId, userCarts] of Object.entries(cartsByUser)) {
      if (userCarts.length <= 1) continue;
      
      console.log(`\nUser ${userId} has ${userCarts.length} carts`);
      
      // Sort by creation date (oldest first)
      const sortedCarts = [...userCarts].sort((a, b) => 
        new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      );
      
      // Keep the oldest cart
      const keepCart = sortedCarts[0];
      const deleteCarts = sortedCarts.slice(1);
      
      console.log(`Keeping cart: ${keepCart._id} (created at: ${keepCart.createdAt || 'unknown'})`);
      console.log(`Deleting ${deleteCarts.length} duplicate carts`);
      
      // Update user's cart reference if needed
      if (userId !== 'no-user') {
        const user = await db.collection('users').findOne({ _id: new mongoose.Types.ObjectId(userId) });
        if (user && (!user.cartId || user.cartId.toString() !== keepCart._id.toString())) {
          console.log(`Updating user ${userId} cart reference to ${keepCart._id}`);
          await db.collection('users').updateOne(
            { _id: new mongoose.Types.ObjectId(userId) },
            { $set: { cartId: new mongoose.Types.ObjectId(keepCart._id) } }
          );
        }
      }
      
      // Delete duplicate carts
      const deleteIds = deleteCarts.map(cart => cart._id);
      if (deleteIds.length > 0) {
        const result = await db.collection('carts').deleteMany({
          _id: { $in: deleteIds }
        });
        totalDeleted += result.deletedCount;
        console.log(`Deleted ${result.deletedCount} duplicate carts`);
      }
    }
    
    console.log(`\nCleanup complete!`);
    console.log(`Total duplicate carts removed: ${totalDeleted}`);
    
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

// Run the cleanup
cleanupDuplicateCarts();
