import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, MapPin, Clock, Users, ArrowRight,
  Ticket, X, Star, ChevronDown, CheckCircle, BookOpen,
} from 'lucide-react';

/* ─────────────────────────────────────────
   EVENT DATA  (one entry per category)
   All image URLs verified working (Unsplash)
───────────────────────────────────────── */
const EVENTS = [
  /* ── Harvest Festival ── */
  {
    id: 1,
    name: 'Tusu Parab',
    emoji: '🌾',
    category: 'Harvest Festival',
    badgeColor: 'bg-amber-100 text-amber-700',
    month: 'January',
    date: '14–15 Jan 2026',
    duration: '2 Days',
    location: 'Purulia & South Jharkhand',
    district: 'Simdega, Gumla, Lohardaga',
    attendees: '50,000+',
    rating: 4.9,
    image: '/tusu.jpg',
    shortDesc: 'A vibrant harvest festival of the Kurmi-Mahato community welcoming the new year with folk songs, dance, and offerings.',
    fullDesc: 'Tusu Parab is one of the most beloved tribal harvest festivals celebrated across southern Jharkhand and Purulia. Observed on Makar Sankranti (mid-January), it marks the end of the agricultural season. Young girls craft beautiful clay idols of Goddess Tusu decorated with colourful flowers, and the community sings traditional "Tusu Geet" throughout the night. On the final day, the effigies are immersed in rivers amidst joyous processions, dance, and the beat of dhol-madal drums.',
    highlights: ['Traditional Tusu Geet (folk songs)', 'Colourful processions & idol immersion', 'Local tribal cuisine & sweets', 'Night-long cultural programs'],
    tips: 'Arrive a day early to witness the idol-making ceremonies. Wrap up warm as nights in January can be chilly.',
    featured: true,
  },
  /* ── Tribal Festival ── */
  {
    id: 2,
    name: 'Bhagta Parab',
    emoji: '🎭',
    category: 'Tribal Festival',
    badgeColor: 'bg-red-100 text-red-700',
    month: 'May',
    date: 'Spring 2026',
    duration: '1 Day',
    location: 'Tamar region, Ranchi',
    district: 'Ranchi, Khunti',
    attendees: '15,000+',
    rating: 4.8,
    image: '/bhagta-parab.jpg',
    shortDesc: 'Bhagta Parab is a very important and unique tribal festival of Jharkhand, which is mainly celebrated between spring and summer season.',
    fullDesc: 'Bhagta Parab is a very important and unique tribal festival of Jharkhand, which is mainly celebrated between spring and summer season. It is mainly celebrated with great enthusiasm in the Tamar region of Jharkhand as a worship of Budha Baba (Mahadev). The festival is characterized by intense devotion and penance, where devotees (Bhagtas) perform the unique wooden pole suspension ritual. Devout crowds gather in Akhara grounds to witness energetic traditional Chhau dance dramas and celebrate deep ancestral roots.',
    highlights: ['Unique wooden pole suspension ritual (Charak)', 'Spectacular Chhau mask dances', 'Devotional fasting by Bhagtas', 'Evening fairs in the Akhara'],
    tips: 'A unique anthropological experience. Be respectful while photographing the intense rituals.',
    featured: true,
  },
  /* ── Nature Festival ── */
  {
    id: 3,
    name: 'Sarhul',
    emoji: '🌸',
    category: 'Nature Festival',
    badgeColor: 'bg-pink-100 text-pink-700',
    month: 'March',
    date: '28 Mar 2026',
    duration: '3 Days',
    location: 'State-wide (Ranchi, Khunti)',
    district: 'All over Jharkhand',
    attendees: '2,00,000+',
    rating: 5.0,
    image: '/sarhul.jpg',
    shortDesc: "Jharkhand's most iconic tribal new-year festival celebrating the blooming of Sal flowers with grand processions.",
    fullDesc: "Sarhul is the most significant festival of the Ho, Munda, and Oraon tribes, celebrated in Chaitra (March-April) when Sal trees bloom. The word 'Sarhul' means 'worship of the Sal.' The Pahan performs rituals under the sacred Sarna tree to ensure a good harvest and protect the village. Massive colourful processions wind through cities — Ranchi sees thousands of tribal men and women dressed in traditional attire carrying Sal flowers. It's a state holiday in Jharkhand.",
    highlights: ['Midnight Sarna tree puja', 'Massive flower processions across Ranchi', 'Traditional Dhol-Nagara beats', 'State holiday with cultural programs'],
    tips: 'Best viewed in Ranchi — head to Morabadi Maidan for the grand procession. Book accommodation weeks in advance.',
    featured: false,
  },
  /* ── Cultural Festival ── */
  {
    id: 4,
    name: 'Karma Puja',
    emoji: '🌿',
    category: 'Cultural Festival',
    badgeColor: 'bg-green-100 text-green-700',
    month: 'August',
    date: '22 Aug 2026',
    duration: '1 Day',
    location: 'All Districts of Jharkhand',
    district: 'Statewide',
    attendees: '3,00,000+',
    rating: 4.7,
    image: '/karma-puja.jpg',
    shortDesc: 'A reverence for the Karma tree symbolizing prosperity, worshipped by tribal youth seeking health and good fortune.',
    fullDesc: 'Karma Puja is a pan-Jharkhand festival celebrated on Ekadashi (eleventh lunar day) of Bhadra month. Youth — especially young women — observe a day-long fast and bring branches of the Karma tree home, decorating them with flowers. The Karma tree is worshipped throughout the night with folk songs (Karma Geet) and group dances. The ritual symbolizes prosperity, longevity, and the bond between siblings. The festival has beautiful parallels with Raksha Bandhan in its sibling-relationship theme.',
    highlights: ['Karma tree worship ceremony', 'All-night Karma Geet singing', 'Traditional group dances', 'Community fasting & feasting'],
    tips: 'Participate respectfully in the evening cultural programs. Many villages welcome visitors for the night puja.',
    featured: false,
  },
  /* ── Harvest Festival ── */
  {
    id: 6,
    name: 'Sohrai',
    emoji: '🐂',
    category: 'Harvest Festival',
    badgeColor: 'bg-amber-100 text-amber-700',
    month: 'October',
    date: 'Oct-Nov 2026',
    duration: '3 Days',
    location: 'State-wide',
    district: 'Statewide',
    attendees: '5,00,000+',
    rating: 4.8,
    image: '/sohrai-puja.jpg',
    shortDesc: 'A winter harvest and cattle worship festival celebrated joyously by tribal communities with incredible art.',
    fullDesc: 'Sohrai is a harvest festival celebrated in the Indian states of Jharkhand, West Bengal, Chhattisgarh, Odisha, and Bihar. It is also called the cattle festival. The festival is observed after the harvest and coincides with Govardhan Puja during Diwali. In Santal Parganas, it is celebrated in the month of January. It is observed by the Santal, Bhumij, Sadan, Oraon, Ho and Munda communities, among others.',
    highlights: ['Worship and decoration of cattle', 'Traditional Sohrai painting on village walls', 'Folk songs and community dances', 'Feasting with rice beer (Handia)'],
    tips: 'A great time to experience rural art. Look out for the beautiful, intricate Sohrai paintings on village homes.',
    featured: true,
  },
];

const CATEGORIES = [
  'All',
  'Harvest Festival',
  'Nature Festival',
  'Cultural Festival',
  'Tribal Festival',
];

const MONTHS = [
  'All Months',
  'January',
  'March',
  'May',
  'August',
  'October',
];

/* ─────────────────────────────────────────
   TOAST NOTIFICATION
───────────────────────────────────────── */
function Toast({ message, onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <AnimatePresence>
      <motion.div
        key="toast"
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 60, scale: 0.9 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3
                   bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-medium
                   pointer-events-none"
      >
        <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
        {message}
      </motion.div>
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────
   FLOATING PARTICLE
───────────────────────────────────────── */
function FloatDot({ x, y, delay, size, color }) {
  return (
    <motion.div
      className={`absolute rounded-full opacity-20 pointer-events-none ${color}`}
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, zIndex: 0 }}
      animate={{ y: [-12, 12, -12], opacity: [0.15, 0.35, 0.15] }}
      transition={{ repeat: Infinity, duration: 5 + delay, delay, ease: 'easeInOut' }}
    />
  );
}

/* ─────────────────────────────────────────
   EVENT MODAL
───────────────────────────────────────── */
function EventModal({ event, onClose, onAddToItinerary, itinerary }) {
  if (!event) return null;

  const alreadyAdded = itinerary.some((e) => e.id === event.id);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[999] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        {/* Modal Card */}
        <motion.div
          className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 40 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Hero Image */}
          <div className="relative h-56 overflow-hidden rounded-t-3xl">
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.backgroundColor = '#1a6b3a'; e.target.style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full ${event.badgeColor}`}>
              {event.category}
            </span>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
            >
              <X size={18} />
            </button>
            <div className="absolute bottom-4 left-4">
              <h2 className="text-3xl font-black text-white">{event.emoji} {event.name}</h2>
              <p className="text-gray-300 text-sm mt-1">{event.date} · {event.location}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Meta Row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Clock size={15} />, label: 'Duration', value: event.duration },
                { icon: <Users size={15} />, label: 'Attendees', value: event.attendees },
                { icon: <Star size={15} className="fill-amber-400 text-amber-400" />, label: 'Rating', value: event.rating },
              ].map((m) => (
                <div key={m.label} className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-400 text-xs mb-1">{m.icon} {m.label}</div>
                  <p className="font-bold text-gray-800 text-sm">{m.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-bold text-gray-800 mb-2 text-lg">About the Festival</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{event.fullDesc}</p>
            </div>

            {/* Districts */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin size={15} className="text-green-700 flex-shrink-0" />
              <span><strong>Districts:</strong> {event.district}</span>
            </div>

            {/* Highlights */}
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Event Highlights</h3>
              <ul className="space-y-2">
                {event.highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      {i + 1}
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Traveller Tip */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">✨ Traveller Tip</p>
              <p className="text-sm text-amber-800">{event.tips}</p>
            </div>

            {/* CTA */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => onAddToItinerary(event)}
                disabled={alreadyAdded}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  alreadyAdded
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : 'bg-green-800 text-white hover:bg-green-900 active:scale-95'
                }`}
              >
                {alreadyAdded ? (
                  <><CheckCircle size={16} /> Added to Itinerary</>
                ) : (
                  <><Ticket size={16} /> Add to Itinerary</>
                )}
              </button>
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────
   EVENT CARD
───────────────────────────────────────── */
function EventCard({ event, onClick, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      whileHover={{ y: -6 }}
      onClick={() => onClick(event)}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all cursor-pointer group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-green-900">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {event.featured && (
          <span className="absolute top-3 right-3 bg-yellow-400 text-gray-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
            ⭐ Featured
          </span>
        )}
        <span className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${event.badgeColor}`}>
          {event.category}
        </span>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-black text-white">{event.emoji} {event.name}</h3>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">{event.shortDesc}</p>
        <div className="space-y-1.5 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className="text-green-700" />
            <span>{event.date} · {event.duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={12} className="text-green-700" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={12} className="text-green-700" />
            <span>{event.attendees} expected</span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-gray-800">{event.rating}</span>
          </div>
          <span className="text-green-800 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
            Learn More <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   FEATURED CARD (large banner)
───────────────────────────────────────── */
function FeaturedCard({ event, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      onClick={() => onClick(event)}
      className="relative rounded-3xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all"
    >
      <div className="h-80 overflow-hidden bg-green-900">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

      <div className="absolute top-5 left-5 flex gap-2 flex-wrap">
        <span className="bg-yellow-400 text-gray-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
          ⭐ Must-See
        </span>
        <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${event.badgeColor}`}>
          {event.category}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h2 className="text-3xl font-black text-white mb-1">{event.emoji} {event.name}</h2>
        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{event.shortDesc}</p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300 mb-4">
          <span className="flex items-center gap-1"><Calendar size={12} /> {event.date}</span>
          <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>
          <span className="flex items-center gap-1"><Users size={12} /> {event.attendees}</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onClick(event); }}
          className="bg-white text-gray-900 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-yellow-400 transition-colors flex items-center gap-2"
        >
          Explore Festival <ArrowRight size={15} />
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   ITINERARY PANEL (slide-out drawer)
───────────────────────────────────────── */
function ItineraryPanel({ itinerary, onRemove, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[900] flex justify-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <motion.div
          className="relative bg-white h-full w-full max-w-sm shadow-2xl overflow-y-auto flex flex-col"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
            <div>
              <h2 className="text-xl font-black text-gray-800">My Itinerary</h2>
              <p className="text-xs text-gray-400 mt-0.5">{itinerary.length} event{itinerary.length !== 1 ? 's' : ''} saved</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 p-4 space-y-3">
            {itinerary.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Ticket size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No events added yet</p>
                <p className="text-sm mt-1">Click "Add to Itinerary" on any festival</p>
              </div>
            ) : (
              itinerary.map((e) => (
                <div key={e.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                  <img src={e.image} alt={e.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-green-900" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-sm truncate">{e.emoji} {e.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{e.date}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mt-1 ${e.badgeColor}`}>
                      {e.category}
                    </span>
                  </div>
                  <button
                    onClick={() => onRemove(e.id)}
                    className="p-1.5 rounded-full hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors flex-shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function Events() {
  /* ── State — all initialised to clean defaults ── */
  const [selectedEvent, setSelectedEvent]   = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeMonth, setActiveMonth]       = useState('All Months');
  const [searchQuery, setSearchQuery]       = useState('');
  const [itinerary, setItinerary]           = useState([]);
  const [showItinerary, setShowItinerary]   = useState(false);
  const [toast, setToast]                   = useState(null);

  /* ── Reset filters whenever the page mounts (fixes HMR stale-state bug) ── */
  useEffect(() => {
    setActiveCategory('All');
    setActiveMonth('All Months');
    setSearchQuery('');
    setSelectedEvent(null);
  }, []);

  /* ── Filter logic — search + category + month all work together ── */
  const filtered = EVENTS.filter((e) => {
    const q = searchQuery.trim().toLowerCase();
    const catOk    = activeCategory === 'All' || e.category === activeCategory;
    const monthOk  = activeMonth === 'All Months' || e.month === activeMonth;
    const searchOk =
      q === '' ||
      e.name.toLowerCase().includes(q) ||
      e.shortDesc.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q) ||
      e.district.toLowerCase().includes(q);
    return catOk && monthOk && searchOk;
  });

  const featured = EVENTS.filter((e) => e.featured);

  /* ── Itinerary handlers ── */
  const handleAddToItinerary = useCallback((event) => {
    setItinerary((prev) => {
      if (prev.some((e) => e.id === event.id)) return prev;
      return [...prev, event];
    });
    setToast(`"${event.name}" added to your itinerary!`);
    setSelectedEvent(null); // close modal after adding
  }, []);

  const handleRemoveFromItinerary = useCallback((id) => {
    setItinerary((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearFilters = useCallback(() => {
    setActiveCategory('All');
    setActiveMonth('All Months');
    setSearchQuery('');
  }, []);

  const handleCategoryClick = useCallback((cat) => {
    setActiveCategory(cat);
  }, []);

  /* Unique key for grid so AnimatePresence remounts on filter change */
  const gridKey = `${activeCategory}||${activeMonth}||${searchQuery}`;
  const hasActiveFilters = activeCategory !== 'All' || activeMonth !== 'All Months' || searchQuery !== '';

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 text-white py-24 px-4 overflow-hidden">
        {/* Floating particles */}
        <FloatDot x={10}  y={20}  delay={0}   size={80}  color="bg-yellow-400" />
        <FloatDot x={80}  y={10}  delay={1}   size={60}  color="bg-white"      />
        <FloatDot x={50}  y={70}  delay={2}   size={100} color="bg-green-400"  />
        <FloatDot x={90}  y={60}  delay={0.5} size={40}  color="bg-yellow-400" />
        <FloatDot x={25}  y={80}  delay={1.5} size={55}  color="bg-white"      />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-5 py-2 rounded-full text-sm font-medium mb-6"
          >
            🎪 Local Events & Festivals
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-5 leading-none flex flex-col items-center justify-center text-center"
          >
            <span className="font-script text-white text-5xl md:text-6xl block mb-2 font-normal tracking-wide">
              Lets Explore
            </span>
            <span className="font-playfair text-yellow-400 text-5xl md:text-7xl font-black tracking-widest uppercase block drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
              Jharkhand
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-green-100 max-w-2xl mx-auto mb-10"
          >
            From the joyous harvest of{' '}
            <strong className="text-yellow-400">Tusu Parab</strong> to the sacred penance of{' '}
            <strong className="text-yellow-400">Bhagta Parab</strong> — immerse in authentic tribal festivities.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative z-20 max-w-md mx-auto"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Scroll to the "All Events" results section on Enter
                const el = document.getElementById('all-events-section');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="relative"
            >
              <input
                id="events-search-input"
                type="text"
                placeholder="Search festivals by name, place…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                className="w-full bg-white/15 backdrop-blur-sm border border-white/30 text-white
                           placeholder-white/60 px-5 py-3.5 rounded-full pr-12 outline-none
                           focus:bg-white/25 focus:border-white/60 transition-all text-sm"
              />
              {/* Submit button — responds to Enter key and click */}
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors bg-transparent border-none cursor-pointer text-base leading-none"
              >
                🔍
              </button>
            </form>
            {searchQuery && (
              <p className="text-white/60 text-xs mt-2">
                Showing results for "<span className="text-yellow-300 font-semibold">{searchQuery}</span>"
                &nbsp;·&nbsp;
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="underline hover:text-white transition-colors"
                >
                  Clear
                </button>
              </p>
            )}
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 60" className="w-full fill-gray-50" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* ── Stats + Itinerary FAB ── */}
      <section className="max-w-5xl mx-auto px-4 -mt-2 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🎪', value: `${EVENTS.length}`, label: 'Annual Events' },
            { icon: '🌾', value: '32+',              label: 'Tribal Festivals' },
            { icon: '📅', value: '12',               label: 'Months of Culture' },
            { icon: '🌍', value: '10L+',             label: 'Festival Visitors' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100"
            >
              <div className="text-2xl mb-1">{s.icon}</div>
              <p className="text-2xl font-black text-green-800">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Featured Events ── */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">🌟 Featured Festivals</h2>
            <p className="text-gray-500 mt-1">Hand-picked, must-experience events of Jharkhand</p>
          </div>
          {/* Itinerary button */}
          <button
            id="itinerary-open-btn"
            onClick={() => setShowItinerary(true)}
            className="relative flex items-center gap-2 bg-green-800 text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-green-900 transition-colors shadow-md"
          >
            <BookOpen size={15} />
            My Itinerary
            {itinerary.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-yellow-400 text-gray-900 text-xs font-black rounded-full flex items-center justify-center">
                {itinerary.length}
              </span>
            )}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {featured.map((event) => (
            <FeaturedCard key={event.id} event={event} onClick={setSelectedEvent} />
          ))}
        </div>
      </section>

      {/* ── Filters ── */}
      <section className="max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2 flex-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                id={`filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleCategoryClick(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-green-800 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Month dropdown */}
          <div className="relative flex-shrink-0">
            <select
              id="month-filter-select"
              value={activeMonth}
              onChange={(e) => setActiveMonth(e.target.value)}
              className="appearance-none bg-gray-100 text-gray-700 text-sm px-4 py-2 pr-8 rounded-full font-medium outline-none cursor-pointer"
            >
              {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ── All Events Grid ── */}
      <section id="all-events-section" className="max-w-7xl mx-auto px-4 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            All Events
            <span className="ml-2 text-base font-normal text-gray-400">({filtered.length} found)</span>
          </h2>
          {hasActiveFilters && (
            <button
              id="clear-filters-btn"
              onClick={clearFilters}
              className="text-sm text-green-800 font-semibold hover:underline flex items-center gap-1"
            >
              <X size={14} /> Clear Filters
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="text-center py-20"
            >
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No events found</h3>
              <p className="text-gray-500">Try adjusting your filters or search term.</p>
              <button
                onClick={clearFilters}
                className="mt-5 bg-green-800 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-green-900 transition-colors"
              >
                Clear All Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={gridKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((event, i) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={setSelectedEvent}
                  index={i}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── Event Modal ── */}
      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onAddToItinerary={handleAddToItinerary}
        itinerary={itinerary}
      />

      {/* ── Itinerary Slide panel ── */}
      <AnimatePresence>
        {showItinerary && (
          <ItineraryPanel
            itinerary={itinerary}
            onRemove={handleRemoveFromItinerary}
            onClose={() => setShowItinerary(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Toast notification ── */}
      <AnimatePresence>
        {toast && <Toast key="toast-msg" message={toast} onDone={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
