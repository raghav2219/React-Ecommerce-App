const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

async function listCollections() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\nCollections in database:');
    
    for (const collection of collections) {
      console.log(`\nCollection: ${collection.name}`);
      console.log('---------------------------');
      
      try {
        const count = await db.collection(collection.name).countDocuments();
        console.log(`Total documents: ${count}`);
        
        if (count > 0) {
          console.log('Sample document:');
          const sample = await db.collection(collection.name).findOne();
          console.log(JSON.stringify(sample, null, 2));
        }
      } catch (err) {
        console.log(`Error reading collection ${collection.name}:`, err.message);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

// Run the function
listCollections();
