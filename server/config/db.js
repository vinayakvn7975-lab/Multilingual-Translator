const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai_translator';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`=======================================================`);
    console.log(`✅ [MongoDB] Connected successfully to: ${conn.connection.name} (${conn.connection.host})`);
    console.log(`=======================================================`);
  } catch (error) {
    isConnected = false;
    console.warn(`=======================================================`);
    console.warn(`⚠️ [MongoDB] Connection Warning: ${error.message}`);
    
    if (error.message.includes('Authentication failed') || error.message.includes('bad auth')) {
      console.warn(`💡 Tip: Check your username, password, or auth database in .env.`);
      console.warn(`   Example Atlas: mongodb+srv://username:password@cluster.mongodb.net/ai_translator?retryWrites=true&w=majority`);
      console.warn(`   Example Local: mongodb://username:password@127.0.0.1:27017/ai_translator?authSource=admin`);
      console.warn(`   Note: If your password has special characters like @ # : ? / percent-encode them! (e.g. @ -> %40)`);
    }

    console.warn(`🔄 Application is running in Hybrid/Memory Fallback Mode.`);
    console.warn(`=======================================================`);
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
