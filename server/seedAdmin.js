import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';

dotenv.config();

const seedAdminUser = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be defined in .env');
    }

    const adminName = 'System Admin';

    let adminUser = await User.findOne({ email: adminEmail });

    if (adminUser) {
      console.log(`[Admin Seed]: User '${adminEmail}' found. Updating role & password from environment variables...`);
      adminUser.role = 'admin';
      adminUser.password = adminPassword;
      await adminUser.save();
    } else {
      console.log(`[Admin Seed]: Creating new Admin User '${adminEmail}' from environment variables...`);
      adminUser = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        track: 'fullstack',
        unlockedTiers: [1, 2, 3, 4, 5],
        xp: 10000,
        level: 10,
      });
    }

    console.log('\n======================================================');
    console.log('✅ Admin Account Synced to MongoDB Atlas!');
    console.log('------------------------------------------------------');
    console.log(`📧 Admin Email   : ${adminEmail}`);
    console.log(`🔑 Admin Password: ${adminPassword}`);
    console.log(`🛡️ Role          : ${adminUser.role}`);
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding Admin User:', error.message);
    process.exit(1);
  }
};

seedAdminUser();
