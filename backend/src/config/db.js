const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const seedIfEmpty = async () => {
  const User = require('../models/User');
  const userCount = await User.countDocuments();
  
  if (userCount === 0) {
    console.log('Database is empty. Seeding initial data...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const Role = require('../models/Role');
    
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

    const Place = require('../models/Place');
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

    const Homestay = require('../models/Homestay');
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

    const Product = require('../models/Product');
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

    console.log('Seeding completed.');
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/atithigram');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    if (process.env.NODE_ENV === 'development') {
      await seedIfEmpty();
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Local MongoDB connection failed (${error.message}). Starting in-memory database fallback...`);
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        
        const conn = await mongoose.connect(mongoUri);
        console.log(`In-Memory MongoDB Connected. You can inspect it directly using this URI: ${mongoUri}`);
        
        await seedIfEmpty();
      } catch (memError) {
        console.error(`In-Memory DB Error: ${memError.message}`);
        process.exit(1);
      }
    } else {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
