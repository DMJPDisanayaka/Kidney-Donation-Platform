import mongoose from 'mongoose';

// Connects to MongoDB Atlas using the URI from environment variables.
const connectDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is missing in environment variables');
  }

  try {
    await mongoose.connect(mongoUri, {
      // Connection options to help with network issues
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
    });
    console.log('✓ MongoDB connected successfully');
  } catch (error) {
    console.error('✗ MongoDB connection failed:');
    console.error(`  Error: ${error.message}`);
    console.error('\n  Troubleshooting steps:');
    console.error('  1. Check MongoDB Atlas Network Access > Add IP Address');
    console.error('  2. Add 0.0.0.0/0 or your IP to whitelist');
    console.error('  3. Verify MONGO_URI in .env file');
    console.error('  4. Check if firewall/VPN is blocking MongoDB connections');
    throw error;
  }
};

export default connectDatabase;
