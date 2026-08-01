import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import dns from 'dns';
import User from '../models/User.js';
import UserProgress from '../models/UserProgress.js';

// Set public Google DNS servers to resolve MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const cleanDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb+srv://chavanshreyas2006_db_user:5WtSBL0fYtDf5SqY@cluster0.e7kwrl4.mongodb.net/shadowcoder?retryWrites=true&w=majority";
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('Connected successfully!');

    // 1. Delete all non-admin users (Preserve Admin Accounts)
    const userDeleteResult = await User.deleteMany({ role: { $ne: 'admin' } });
    console.log(`[Clean DB]: Deleted ${userDeleteResult.deletedCount} non-admin user accounts.`);

    // 2. Delete all temporary user progress records
    const progressDeleteResult = await UserProgress.deleteMany({});
    console.log(`[Clean DB]: Deleted ${progressDeleteResult.deletedCount} test progress records.`);

    // 3. Count remaining Admin accounts
    const adminCount = await User.countDocuments({ role: 'admin' });
    console.log(`[Clean DB]: Preserved ${adminCount} Admin account(s).`);

    console.log('Database cleanup complete! Closing connection...');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Database Cleanup Failed:', err.message);
    process.exit(1);
  }
};

cleanDatabase();
