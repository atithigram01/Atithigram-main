const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Place = require('./models/Place');
const Homestay = require('./models/Homestay');
const Product = require('./models/Product');
require('dotenv').config();

const seedData = async () => {
  try {
    let mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/atithigram';
    
    try {
      console.log('Connecting to MongoDB...');
      await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
      console.warn(`Local MongoDB connection failed (${error.message}). Starting in-memory database fallback...`);
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log(`In-Memory MongoDB Connected: ${mongoose.connection.host}`);
    }

    // Clear existing data
    await User.deleteMany();
    await Place.deleteMany();
    await Homestay.deleteMany();
    await Product.deleteMany();

    // Create Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const Role = require('./models/Role');
    await Role.deleteMany();
    
    const roleUser = await Role.create({ name: 'User', permissions: [] });
    const roleAdmin = await Role.create({ name: 'Admin', permissions: ['manage_users', 'manage_homestays'] });
    const roleHost = await Role.create({ name: 'Host', permissions: ['create_homestay'] });
    const roleSeller = await Role.create({ name: 'Seller', permissions: ['create_product'] });

    const users = await User.create([
      {
        name: 'Deepak Kumar',
        email: 'deepak@gmail.com',
        password: hashedPassword,
        role: roleUser._id,
        ecoPoints: 500
      },
      {
        name: 'Admin User',
        email: 'admin@atithigram.com',
        password: hashedPassword,
        role: roleAdmin._id
      },
      {
        name: 'Host User',
        email: 'host@gmail.com',
        password: hashedPassword,
        role: roleHost._id
      }
    ]);

    console.log('Users Seeded');

    // Create some Places
    await Place.create([
      {
        name: 'Hundru Falls',
        description: 'A stunning 98m waterfall near Ranchi, surrounded by lush green forests.',
        category: 'Eco',
        coordinates: { lat: 23.41, lng: 85.67 },
        images: ['/hundru-falls.jpg']
      },
      {
        name: 'Dassam Falls',
        description: 'A spectacular waterfall in Ranchi district.',
        category: 'Eco',
        coordinates: { lat: 23.23, lng: 85.32 },
        images: ['/dassam-falls.jpg']
      },
      {
        name: 'Pahari Mandir',
        description: 'A temple dedicated to Lord Shiva on a hilltop.',
        category: 'Heritage',
        coordinates: { lat: 23.37, lng: 85.32 },
        images: ['/pahari-mandir.jpg']
      }
    ]);

    console.log('Places Seeded');

    // Create some Homestays
    await Homestay.create([
      {
        hostId: users[2]._id,
        name: 'Tribal Hermitage',
        location: 'Khunti, Jharkhand',
        pricePerNight: 1500,
        images: ['https://images.unsplash.com/photo-1587061949409-02df41d5e562'],
        isVerified: true
      }
    ]);

    console.log('Homestays Seeded');

    // Create some Products
    await Product.create([
      {
        sellerId: users[2]._id,
        name: 'Sohrai Painting',
        description: 'Traditional tribal art from Jharkhand.',
        price: 1200,
        images: ['https://images.unsplash.com/photo-1578301978693-85fa9c0320b9'],
        isVerified: true
      }
    ]);

    console.log('Products Seeded');

    console.log('Database Seeding Completed Successfully');
    process.exit(0);
  } catch (error) {
    console.error(`Error with seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();
