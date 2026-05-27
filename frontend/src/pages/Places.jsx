import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';
import { getPlaces } from '../services/api';

// Static fallback data if API is not available
const STATIC_PLACES = [
  { _id: '1', name: 'Hundru Falls', category: 'Eco', description: 'A stunning 98m waterfall near Ranchi, surrounded by lush green forests.', images: ['/hundru-falls.jpg'], coordinates: { lat: 23.41, lng: 85.67 } },
  { _id: '2', name: 'Betla National Park', category: 'Eco', description: 'First national park in Jharkhand, home to tigers, elephants, and leopards.', images: ['/betla-national-park.jpg'], coordinates: { lat: 23.92, lng: 84.13 } },
  { _id: '3', name: 'Baidyanath Temple', category: 'Heritage', description: 'One of the 12 Jyotirlingas of Shiva, a major pilgrimage site in Deoghar.', images: ['/baidyanath-temple.jpg'], coordinates: { lat: 24.49, lng: 86.70 } },
  { _id: '4', name: 'Ranchi Lake', category: 'Eco', description: 'A serene man-made lake at the heart of the capital city, perfect for boating.', images: ['/ranchi-lake.jpg'], coordinates: { lat: 23.36, lng: 85.33 } },
  { _id: '5', name: 'Jagannath Temple Ranchi', category: 'Heritage', description: 'A miniature version of the famous Puri Jagannath Temple, built in 1691.', images: ['/jagannath-temple-ranchi.jpg'], coordinates: { lat: 23.37, lng: 85.32 } },
  { _id: '7', name: 'Dassam Falls', category: 'Eco', description: 'A spectacular waterfall in Ranchi district.', images: ['/dassam-falls.jpg'], coordinates: { lat: 23.23, lng: 85.32 } },
  { _id: '8', name: 'Pahari Mandir', category: 'Heritage', description: 'A temple dedicated to Lord Shiva on a hilltop.', images: ['/pahari-mandir.jpg'], coordinates: { lat: 23.37, lng: 85.32 } },
  { _id: '9', name: 'Maa Dewri Mandir (Deori Temple)', category: 'Heritage', description: 'An ancient 700-year-old temple in Diuri village, Tamar, dedicated to the 16-armed deity Maa Dewri. Renowned for its unique construction of interlocking stones without binding materials.', images: ['/deuri-mandir.jpg'], coordinates: { lat: 23.0461, lng: 85.6828 } },
];

const CATEGORIES = ['All', 'Eco', 'Cultural', 'Heritage'];

const categoryColors = {
  'Eco': 'bg-green-100 text-green-700',
  'Cultural': 'bg-purple-100 text-purple-700',
  'Heritage': 'bg-amber-100 text-amber-700',
};

export default function Places() {
  const [places, setPlaces] = useState(STATIC_PLACES);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getPlaces().then(({ data }) => { 
      if (data && data.length > 0) {
        const dbPlacesMerged = data.map(dbPlace => {
          const staticMatch = STATIC_PLACES.find(sp => sp.name === dbPlace.name);
          if (staticMatch && (!dbPlace.images || dbPlace.images.length === 0 || dbPlace.images[0]?.includes('wikipedia'))) {
            return { ...dbPlace, images: staticMatch.images };
          }
          return dbPlace;
        });

        // Ensure we still show the static places if DB doesn't have them
        const existingNames = dbPlacesMerged.map(p => p.name);
        const missingStaticPlaces = STATIC_PLACES.filter(sp => !existingNames.includes(sp.name));
        
        setPlaces([...dbPlacesMerged, ...missingStaticPlaces]);
      }
    }).catch(() => {});
  }, []);

  const filtered = places.filter((p) => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = (p?.name || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-light">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-green-700 text-white py-16 px-4 text-center flex flex-col items-center justify-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-4 leading-none flex flex-col items-center justify-center"
        >
          <span className="font-script text-white text-4xl md:text-5xl block mb-2 font-normal tracking-wide">
            Explore
          </span>
          <span className="font-playfair text-accent text-5xl md:text-6xl font-black tracking-widest uppercase block drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
            Jharkhand
          </span>
        </motion.h1>
        <p className="text-lg text-green-100 max-w-xl mx-auto">Discover eco-spots, heritage temples, and vibrant tribal cultures.</p>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full font-medium transition-all ${activeCategory === cat ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search places..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary" />
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((place, i) => (
            <motion.div key={place._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer">
              <div className="h-48 overflow-hidden">
                <img src={place.images?.[0] || 'https://via.placeholder.com/400x200'} alt={place.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-5">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[place.category]}`}>
                  {place.category}
                </span>
                <h3 className="text-xl font-bold mt-3 mb-2 text-dark">{place.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{place.description}</p>
                <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
                  <MapPin size={12} />
                  <span>{Number(place.coordinates?.lat || 0).toFixed(2)}°N, {Number(place.coordinates?.lng || 0).toFixed(2)}°E</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">No places found matching your search.</div>
        )}
      </div>
    </div>
  );
}
