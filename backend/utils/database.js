const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/trustguard';

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = true;
    console.log('✅ MongoDB connected:', uri);
  } catch (err) {
    console.warn('⚠️  MongoDB connection failed. Running without persistence.');
    console.warn('   Error:', err.message);
    console.warn('   Start MongoDB or set MONGODB_URI in .env\n');
    // Don't crash — allow demo mode / in-memory fallback
  }
};

module.exports = connectDB;
