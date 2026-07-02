import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Search, 
  Calendar, 
  Clock, 
  Compass, 
  ShieldCheck, 
  Phone, 
  Globe, 
  Sparkles, 
  CheckCircle, 
  Ticket, 
  X, 
  Users, 
  ArrowRight 
} from 'lucide-react';
import { getAdventures, updateEcoPoints } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Static fallback data matching the seeded database items
const STATIC_ADVENTURES = [
  {
    _id: 'adv1',
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
    _id: 'adv2',
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
    _id: 'adv3',
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
    _id: 'adv4',
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
];

const CATEGORIES = ['All', 'Water Park', 'Snow Park'];

const difficultyColors = {
  'Easy': 'bg-green-100 text-green-700 border-green-200',
  'Moderate': 'bg-blue-100 text-blue-700 border-blue-200',
  'Hard': 'bg-red-100 text-red-700 border-red-200',
};

export default function Adventure() {
  const navigate = useNavigate();
  const [adventures, setAdventures] = useState(STATIC_ADVENTURES);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedAdv, setSelectedAdv] = useState(null); // For booking modal
  
  // Booking Form State
  const [visitorCount, setVisitorCount] = useState(1);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, reloadUserData } = useAuth();

  useEffect(() => {
    getAdventures()
      .then(({ data }) => {
        if (data && data.length > 0) {
          // Merge API data with static match images if needed
          const merged = data.map(dbAdv => {
            const staticMatch = STATIC_ADVENTURES.find(sa => sa.name.toLowerCase() === dbAdv.name.toLowerCase());
            if (staticMatch && (!dbAdv.images || dbAdv.images.length === 0)) {
              return { ...dbAdv, images: staticMatch.images };
            }
            return dbAdv;
          });

          // Ensure static items exist in output
          const dbNames = merged.map(p => p.name.toLowerCase());
          const missingStatic = STATIC_ADVENTURES.filter(sa => !dbNames.includes(sa.name.toLowerCase()));
          
          setAdventures([...merged, ...missingStatic]);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = adventures.filter(adv => {
    const matchCat = activeCategory === 'All' || adv.activityType === activeCategory;
    const matchSearch = adv.name.toLowerCase().includes(search.toLowerCase()) || 
                        (adv.location || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const openBookingModal = (adv) => {
    setSelectedAdv(adv);
    setVisitorCount(1);
    // Set default tomorrow date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split('T')[0]);
    setBookingSuccess(false);
    setGeneratedTicket('');
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please Sign In to book this adventure and earn eco-rewards points!');
      return;
    }
    setLoading(true);
    
    // Simulate booking with dynamic Eco-points updates
    setTimeout(async () => {
      const pointsToEarn = visitorCount * 50; // 50 points per visitor
      try {
        await updateEcoPoints(pointsToEarn);
        await reloadUserData(); // Reload context points
      } catch (err) {
        console.error('Error adding points', err);
      }
      
      const ticketNum = 'ATG-ADV-' + Math.floor(100000 + Math.random() * 900000);
      setGeneratedTicket(ticketNum);
      setBookingSuccess(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Premium Parallax Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-900 via-emerald-800 to-cyan-900 text-white py-20 px-6 sm:px-12 md:py-28 text-center shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-40 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-tight text-white leading-tight"
          >
            Unleash Your <span className="bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">Adventure Spirit</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg md:text-xl text-emerald-100/90 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Discover the most thrilling water parks and aquatic adventures in Jharkhand, featuring world-class slides, lazy rivers, and refreshing family retreats.
          </motion.p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-6 items-center justify-between">
          
          {/* Category Tabs */}
          <div className="flex gap-2 flex-wrap justify-center lg:justify-start w-full lg:w-auto">
            {CATEGORIES.map((cat) => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCategory === cat 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-105' 
                    : 'bg-slate-50 text-slate-600 border border-slate-200/80 hover:border-emerald-600/50 hover:bg-slate-100/50'
                }`}
              >
                {cat === 'All' ? '🏕️ All Adventures' : cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-80">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by spot or location..."
              className="w-full pl-11 pr-5 py-3 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-sm" 
            />
          </div>

        </div>

        {/* Grid Display */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {filtered.map((adv, i) => (
            <motion.div 
              key={adv._id} 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
            >
              {/* Image Container */}
              <div className="h-56 relative overflow-hidden group">
                <img 
                  src={adv.images?.[0] || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5'} 
                  alt={adv.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-emerald-800 shadow-sm border border-white/20">
                  {adv.activityType}
                </div>
                {adv.difficulty && (
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold border ${difficultyColors[adv.difficulty] || 'bg-slate-100 text-slate-800 border-slate-200'}`}>
                    {adv.difficulty} Level
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2 leading-snug">{adv.name}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">
                    {adv.description || `${adv.name} is a premier ${adv.activityType.toLowerCase()} located in ${adv.location.split(',')[0]}. Come enjoy standard slides, recreation, and fun moments.`}
                  </p>

                  {/* Badges / Specifications */}
                  <div className="space-y-2.5 border-t border-slate-100 pt-4 mb-6">
                    <div className="flex items-start gap-2.5 text-xs text-slate-600">
                      <MapPin size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="leading-normal">{adv.location}</span>
                    </div>
                    {adv.bestSeason && (
                      <div className="flex items-center gap-2.5 text-xs text-slate-600">
                        <Calendar size={14} className="text-emerald-600 flex-shrink-0" />
                        <span>Best: {adv.bestSeason}</span>
                      </div>
                    )}
                    {adv.timing && (
                      <div className="flex items-center gap-2.5 text-xs text-slate-600">
                        <Clock size={14} className="text-emerald-600 flex-shrink-0" />
                        <span>Hours: {adv.timing}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 bg-slate-50/80 px-3 py-2 rounded-xl mt-3">
                      <span>🏷️ Entry Fee:</span>
                      <span className="text-emerald-700 font-bold">{adv.entryFee}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex mt-auto pt-2 w-full">
                  <button 
                    onClick={() => navigate(`/map?select=${encodeURIComponent(adv.name)}&route=true`)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-2xl text-xs transition-all shadow-md shadow-emerald-600/10 cursor-pointer"
                  >
                    <MapPin size={14} />
                    Get Directions
                  </button>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 mt-10">
            <Compass size={40} className="mx-auto text-slate-300 mb-4 animate-bounce" />
            <p className="text-slate-400 font-medium">No adventure spots found matching your filter criteria.</p>
          </div>
        )}
      </div>

    </div>
  );
}
