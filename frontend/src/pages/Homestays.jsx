import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Users, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { getHomestays } from '../services/api';
import BookingModal from '../components/BookingModal';

const STATIC_HOMESTAYS = [
  {
    _id: '1',
    name: 'Nature Nest Homestay',
    location: 'Netarhat, Jharkhand',
    pricePerNight: 1200,
    hostId: { name: 'Ram Oraon' },
    images: ['https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800'],
    isVerified: true,
    rating: 4.9,
    reviews: 38,
    amenities: ['WiFi', 'Meals', 'Forest View'],
  },
  {
    _id: '2',
    name: 'Santal Heritage House',
    location: 'Dumka, Jharkhand',
    pricePerNight: 900,
    hostId: { name: 'Sita Devi' },
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
    isVerified: true,
    rating: 4.7,
    reviews: 22,
    amenities: ['Cultural Tours', 'Meals', 'Garden'],
  },
  {
    _id: '3',
    name: 'Jharkhand Forest Retreat',
    location: 'Betla, Jharkhand',
    pricePerNight: 1500,
    hostId: { name: 'Birsa Munda' },
    images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800'],
    isVerified: true,
    rating: 5.0,
    reviews: 51,
    amenities: ['Safari', 'Bonfire', 'Forest View'],
  },
  {
    _id: '4',
    name: 'Eco River View',
    location: 'Koderma, Jharkhand',
    pricePerNight: 800,
    hostId: { name: 'Laxmi Prasad' },
    images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800'],
    isVerified: true,
    rating: 4.6,
    reviews: 17,
    amenities: ['River View', 'Fishing', 'Meals'],
  },
];

export default function Homestays() {
  const [homestays, setHomestays] = useState(STATIC_HOMESTAYS);
  const [bookingTarget, setBookingTarget] = useState(null); // the stay to book
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    getHomestays()
      .then(({ data }) => { if (data.length > 0) setHomestays(data); })
      .catch(() => {});
  }, []);

  const sorted = [...homestays].sort((a, b) => {
    if (sortBy === 'price-asc') return a.pricePerNight - b.pricePerNight;
    if (sortBy === 'price-desc') return b.pricePerNight - a.pricePerNight;
    if (sortBy === 'rating') return (b.rating ?? 0) - (a.rating ?? 0);
    return 0;
  });

  return (
    <div className="min-h-screen bg-light">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-green-700 text-white py-16 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Verified Homestays
        </motion.h1>
        <p className="text-lg text-green-100 max-w-xl mx-auto">
          Stay with local families. Experience authentic Jharkhand. Every booking directly funds the host family.
        </p>
        <div className="flex justify-center gap-6 mt-6 text-sm text-green-200">
          <span>✅ Admin Verified</span>
          <span>🌱 +20 Eco-Points per booking</span>
          <span>🏡 25% goes to platform</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Sort bar */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-600 font-medium">{sorted.length} homestays available</p>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-8">
          {sorted.map((stay, i) => (
            <motion.div
              key={stay._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={stay.images?.[0]}
                  alt={stay.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                {stay.isVerified && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow">
                    <ShieldCheck size={12} /> Verified
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-dark text-xs font-bold px-2.5 py-1 rounded-full shadow">
                  🌱 +20 pts
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-xl text-dark">{stay.name}</h3>
                    <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
                      <MapPin size={13} /> {stay.location}
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-sm mt-0.5">
                      <Users size={13} /> Host: {stay.hostId?.name}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-primary">₹{stay.pricePerNight}</p>
                    <p className="text-xs text-gray-400">per night</p>
                  </div>
                </div>

                {/* Rating */}
                {stay.rating && (
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={13}
                        className={s <= Math.round(stay.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                      />
                    ))}
                    <span className="text-sm font-semibold text-dark ml-1">{stay.rating}</span>
                    <span className="text-xs text-gray-400">({stay.reviews} reviews)</span>
                  </div>
                )}

                {/* Amenities */}
                {stay.amenities && (
                  <div className="flex gap-2 flex-wrap mb-4">
                    {stay.amenities.map((a) => (
                      <span key={a} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{a}</span>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setBookingTarget(stay)}
                  className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-green-900 transition-colors mt-1"
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {bookingTarget && (
        <BookingModal stay={bookingTarget} onClose={() => setBookingTarget(null)} />
      )}
    </div>
  );
}
