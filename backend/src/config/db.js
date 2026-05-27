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
      },
      {
        name: 'Maa Dewri Mandir (Deori Temple)',
        description: 'An ancient 700-year-old temple in Diuri village, Tamar, dedicated to the 16-armed deity Maa Dewri. Renowned for its unique construction of interlocking stones without binding materials.',
        category: 'Heritage',
        coordinates: { lat: 23.0461, lng: 85.6828 },
        images: ['/deuri-mandir.jpg']
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
        description: 'Traditional tribal art from Jharkhand, depicting cattle, nature, and harvest blessings.',
        price: 1200,
        images: ['https://images.unsplash.com/photo-1578301978693-85fa9c0320b9'],
        isVerified: true
      },
      {
        sellerId: users[2]._id,
        name: 'Bamboo Basket',
        description: 'Beautifully crafted round bamboo basket for home utility and organic storage.',
        price: 550,
        images: ['/handicrafts/item5.png'],
        isVerified: true
      },
      {
        sellerId: users[2]._id,
        name: 'Classic Bamboo Pen Holder',
        description: 'Functional and eco-friendly bamboo pen holder for your desk.',
        price: 250,
        images: ['/handicrafts/item1.png'],
        isVerified: true
      },
      {
        sellerId: users[2]._id,
        name: 'Bamboo Flower Vase',
        description: 'Beautiful handcrafted bamboo vase shown with artificial red flowers.',
        price: 450,
        images: ['/handicrafts/item2.png'],
        isVerified: true
      },
      {
        sellerId: users[2]._id,
        name: 'Floral Bamboo Wall Hanging',
        description: 'Decorative bamboo grid wall hanging featuring pink artificial flowers.',
        price: 650,
        images: ['/handicrafts/item3.png'],
        isVerified: true
      },
      {
        sellerId: users[2]._id,
        name: 'Bamboo Pen Stand Set',
        description: 'Handcrafted bamboo pen stand set with multiple compartments.',
        price: 750,
        images: ['/handicrafts/item4.png'],
        isVerified: true
      },
      {
        sellerId: users[2]._id,
        name: 'Grid Bamboo Wall Decor',
        description: 'Decorative diamond grid wall piece made of natural bamboo.',
        price: 600,
        images: ['/handicrafts/item6.png'],
        isVerified: true
      },
      {
        sellerId: users[2]._id,
        name: 'Diamond Bamboo Wall Decor',
        description: 'Intricate diamond-shaped bamboo wall decor piece for home interiors.',
        price: 850,
        images: ['/handicrafts/item7.jpg'],
        isVerified: true
      }
    ]);

    console.log('Seeding completed.');
  }
};

const seedAdventures = async () => {
  const Adventure = require('../models/Adventure');
  
  const count = await Adventure.countDocuments();
  if (count > 0) {
    return; // Already seeded, skip!
  }
  
  console.log('Adventures collection is empty. Seeding initial Excel adventure data...');
  
  await Adventure.create([
    {
      name: 'WILD WAADI WATER PARK BOKARO',
      activityType: 'Water Park',
      location: 'Village Kashiridih, post, Ulgara, Jharkhand 827013',
      mapsLink: 'https://maps.app.goo.gl/8u11MexXq3w6vKGW8',
      description: "Bokaro's premier aquatic recreational hub, featuring thrilling water slides, dynamic wave pools, and dedicated children's splash zones for families.",
      bestSeason: 'Summer',
      entryFee: '₹200 - ₹500',
      timing: '9:00 AM - 5:00 PM',
      difficulty: 'Moderate',
      safetyAvailable: 'Yes',
      images: ['/wild-waadi-bokaro.jpg'],
      contactInfo: 'https://wildwaadi.com/',
      onlineBooking: false,
      additionalNotes: 'Appropriate swimwear required. Lockers and costumes are available on hire.'
    },
    {
      name: 'Wild Waadi Water Park, Ranchi',
      activityType: 'Water Park',
      location: 'Plot 311, Dasmile Chowk, Road, near Taurian World School Devi Mandap, Ranchi, Hajam, Jharkhand 835221',
      mapsLink: 'https://share.google/eSzFA8hbJe9FB1YOF',
      description: 'A spectacular water park in Ranchi providing a complete retreat with international standard rides, a multi-play system, lazy river, and beautiful lush surroundings.',
      bestSeason: 'Summer',
      entryFee: '₹250 - ₹500',
      timing: '9:00 AM - 5:00 PM',
      difficulty: 'Moderate',
      safetyAvailable: 'Yes',
      images: [
        '/wild-waadi-ranchi-1.jpg',
        '/wild-waadi-ranchi-2.jpg'
      ],
      contactInfo: 'https://wildwaadi.com/',
      onlineBooking: false,
      additionalNotes: 'Perfect weekend destination for families and student groups.'
    },
    {
      name: 'Funmagica Waterpark & Resort',
      activityType: 'Water Park',
      location: ' Purulia Rd, near gurukul public school, Chas, chas, Kashi Jharia, Bokaro Steel City, Jharkhand 827013',
      mapsLink: 'https://maps.app.goo.gl/ozhBipdSMzp1YGSf6',
      description: 'Enjoy a magical blend of aquatic slides, swimming zones, and high-end resort amenities. Features rain dancing and an open-air cafeteria.',
      bestSeason: 'Summer',
      entryFee: '₹250 - ₹500',
      timing: '9:00 AM - 5:00 PM',
      difficulty: 'Moderate',
      safetyAvailable: 'Yes',
      images: [
        '/fun-magica-1.webp',
        '/fun-magica-2.webp'
      ],
      contactInfo: 'https://funmagica.com/',
      onlineBooking: false,
      additionalNotes: 'Special packages available for birthdays, private parties, and corporate events.'
    },
    {
      name: 'SNOWLAND RANCHI',
      activityType: 'Snow Park',
      location: ' NEAR TONKO BRIDGE, RING ROAD TUPUDANA,, Ranchi, Jharkhand 834003',
      mapsLink: 'https://share.google/bQJC6JB8Ia6GwqGNx',
      description: 'Experience the thrill of a snowy winter wonderland in the heart of Ranchi! Snowland offers dynamic indoor snow slides, sub-zero ice gaming arenas, real snow showers, and beautifully crafted ice sculptures.',
      bestSeason: 'All Seasons',
      entryFee: '₹400 - ₹500',
      timing: '9:00 AM - 5:00 PM',
      difficulty: 'Moderate',
      safetyAvailable: 'Yes',
      images: ['/snowland-ranchi.jpg'],
      contactInfo: 'https://www.instagram.com/snowlandranchi?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
      onlineBooking: false,
      additionalNotes: 'Sub-zero winter jackets and thermal boots are provided at the entrance. Great for photography!'
    }
  ]);
  console.log('Adventure seeding completed.');
};;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/atithigram', {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    // Unconditionally call seeding — they check if collections are empty,
    // making them 100% safe for production and auto-seeds live databases!
    await seedIfEmpty();
    await seedAdventures();
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
        await seedAdventures();
      } catch (memError) {
        console.error(`In-Memory DB Error: ${memError.message}`);
        process.exit(1);
      }
    } else {
      console.error(`MongoDB connection error: ${error.message}`);
      // Don't call process.exit in production/serverless — let the
      // function stay alive so individual requests can return proper errors.
    }
  }
};

module.exports = connectDB;
