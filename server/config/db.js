import mongoose from 'mongoose';
import dns from 'dns';

const connectDB = async () => {
  try {
    // Set public Google DNS servers to resolve MongoDB Atlas SRV records
    try {
      dns.setServers(['8.8.8.8', '1.1.1.1']);
    } catch (e) {
      console.warn('Warning: Failed to set public DNS servers, connecting to MongoDB with default DNS:', e.message);
    }

    // Attempt to connect to the database using the URI from our .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    // Exit the Node process if the database connection fails
    process.exit(1);
  }
};

export default connectDB;