const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

const seedAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@gaurakshak.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin already exists');
      process.exit(0);
    }

    // Create default admin
    const admin = await Admin.create({
      name: 'Gaurakshak Admin',
      email: 'admin@gaurakshak.com',
      password: 'admin123',
      role: 'superadmin',
    });

    console.log(`✅ Admin created successfully!`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: admin123`);
    console.log(`   Role: ${admin.role}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed Error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
