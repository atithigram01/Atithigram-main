import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Leaf, ShieldCheck, Users, Star, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPlaces, getAdventures, getProducts, getHomestays } from '../services/api';

const FEATURED_PLACES = [
  {
    name: 'Hundru Falls',
    category: 'Eco',
    tagline: '98-metre waterfall near Ranchi',
    img: '/hundru-falls.jpg',
  },
  {
    name: 'Baidyanath Dham',
    category: 'Heritage',
    tagline: 'Sacred Jyotirlinga in Deoghar',
    img: '/baidyanath-temple.jpg',
  },
  {
    name: 'Betla National Park',
    category: 'Eco',
    tagline: 'Tigers, elephants & pristine forest',
    img: '/betla-national-park.jpg',
  },
];

const CATEGORY_BADGE = {
  Eco:     'bg-green-100 text-green-700',
  Heritage:'bg-amber-100 text-amber-700',
  Cultural:'bg-purple-100 text-purple-700',
};

export default function Home() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    places: 9,
    adventures: 4,
    travellers: 1250
  });

  useEffect(() => {
    Promise.all([
      getPlaces().catch(() => ({ data: [] })),
      getAdventures().catch(() => ({ data: [] }))
    ]).then(([placesRes, adventuresRes]) => {
      const placesCount = placesRes.data?.length || 9;
      const adventuresCount = adventuresRes.data?.length || 6;
      
      setCounts({
        places: placesCount,
        adventures: adventuresCount,
        travellers: Math.max(1200, (placesCount + adventuresCount) * 85)
      });
    }).catch(() => {});
  }, []);

  const statsData = [
    { value: `${counts.places}+`, label: 'Tourist Spots', icon: '🗺️' },
    { value: `${counts.adventures}+`, label: 'Adventure Activities', icon: '🤠' },
    { value: '12+', label: 'Festivals & Events', icon: '🎪' },
    { value: `${counts.travellers}+`, label: 'Happy Travellers', icon: '😊' },
  ];

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative h-[88vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0b2916] via-[#064e3b] to-[#0f172a]">
        {/* Subtle radial light glow in center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.18)_0%,_transparent_65%)] z-10 pointer-events-none" />
        
        {/* Premium Nature Backdrop Blended with Gradient */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0 scale-105 opacity-40 mix-blend-overlay"
          style={{
            backgroundImage: 'url("/hundru-falls.jpg")',
          }}
        />
        
        {/* Bottom vignette shadow overlay for high legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b2916]/50 via-black/20 to-black/85 z-10" />

        <div className="relative z-20 text-center text-white px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-5 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Leaf size={14} className="text-accent" />
            Jharkhand's #1 Eco-Tourism Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 leading-none flex flex-col items-center justify-center text-center w-full"
          >
            <span className="font-script text-white text-5xl md:text-7xl block mb-2 font-normal tracking-wide">
              Lets Explore
            </span>
            <span className="font-playfair text-accent text-4xl sm:text-6xl md:text-8xl font-black tracking-wider sm:tracking-widest uppercase block drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] w-full break-words">
              Jharkhand
            </span>
          </motion.h1>
 
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl mb-10 font-light text-gray-200 max-w-3xl mx-auto px-2"
          >
            A sustainable journey into eco-tourism, tribal culture, and thrilling adventures.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/places')}
              className="bg-secondary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-green-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2 justify-center"
            >
              Start Exploring <ArrowRight size={20} />
            </button>
            <button
              onClick={() => navigate('/planner')}
              className="bg-white/15 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/25 transition-all flex items-center gap-2 justify-center"
            >
              ✨ AI Trip Planner
            </button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── Stats Banner ── */}
      <section className="bg-primary py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {statsData.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center text-white"
            >
              <div className="text-3xl mb-1">{s.icon}</div>
              <p className="text-3xl font-black text-accent">{s.value}</p>
              <p className="text-green-200 text-sm mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Why Choose ── */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block bg-green-50 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4"
          >
            Why ATITHIGRAM?
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-5 text-dark">
            Travel with Purpose
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            We bring you verified, authentic, and eco-friendly travel experiences directly supporting local communities.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<MapPin size={36} className="text-accent" />}
            title="Hidden Geotagged Spots"
            desc="Explore off-beat waterfalls, ancient temples, and forests unknown to the typical tourist."
            gradient="from-amber-50 to-yellow-50"
          />
          <FeatureCard
            icon={<Leaf size={36} className="text-secondary" />}
            title="Eco-Points System"
            desc="Travel sustainably. Earn Eco-Points for responsible tourism choices and redeem them for exclusive rewards."
            gradient="from-green-50 to-emerald-50"
          />
          <FeatureCard
            icon={<Users size={36} className="text-primary" />}
            title="Tribal Culture & Festivals"
            desc="Immerse yourself in authentic tribal heritage, cattle worship rituals, and local harvest festivals of Jharkhand."
            gradient="from-blue-50 to-indigo-50"
          />
        </div>
      </section>

      {/* ── Featured Places ── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-dark">Featured Destinations</h2>
              <p className="text-gray-500 mt-2">Hand-picked experiences you won't find elsewhere</p>
            </div>
            <button
              onClick={() => navigate('/places')}
              className="hidden md:flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              View All <ArrowRight size={18} />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURED_PLACES.map((place, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -6 }}
                onClick={() => navigate('/places')}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={place.img}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm ${CATEGORY_BADGE[place.category]}`}>
                    {place.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-dark mb-1">{place.name}</h3>
                  <p className="text-gray-500 text-sm">{place.tagline}</p>
                  <div className="flex items-center gap-1 mt-3">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} size={13} className="fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">5.0</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <button
              onClick={() => navigate('/places')}
              className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-green-900 transition-colors"
            >
              View All Places
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-green-700 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-5xl mb-5">🌿</div>
          <h2 className="text-4xl font-bold mb-4">Become a Responsible Traveller</h2>
          <p className="text-green-200 text-lg mb-8">
            Join thousands of travellers already earning Eco-Points while exploring Jharkhand sustainably.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/signup')}
              className="bg-accent text-dark px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-all shadow-lg"
            >
              Join Free Today
            </button>
            <button
              onClick={() => navigate('/rewards')}
              className="bg-white/15 backdrop-blur text-white border border-white/30 px-8 py-4 rounded-full font-semibold hover:bg-white/25 transition-all"
            >
              View Eco-Rewards
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc, gradient }) {
  return (
    <motion.div
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className={`bg-gradient-to-br ${gradient} p-8 rounded-2xl border border-gray-100 hover:shadow-md transition-all text-center`}
    >
      <div className="inline-flex p-4 bg-white rounded-2xl shadow-sm mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3 text-dark">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </motion.div>
  );
}
