import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Shield, Leaf, MapPin, Calendar, Edit3, Check, X, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMyBookings } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ROLE_COLORS = {
  Admin:  { bg: 'bg-red-100',    text: 'text-red-700'   },
  Host:   { bg: 'bg-purple-100', text: 'text-purple-700' },
  Seller: { bg: 'bg-amber-100',  text: 'text-amber-700'  },
  User:   { bg: 'bg-blue-100',   text: 'text-blue-700'   },
};

const MOCK_BOOKINGS = [
  { _id: 'b1', homestayId: { name: 'Nature Nest Homestay', location: 'Netarhat' }, checkIn: '2024-03-10', checkOut: '2024-03-13', totalAmount: 3600, status: 'confirmed' },
  { _id: 'b2', homestayId: { name: 'Eco River View', location: 'Koderma' },        checkIn: '2024-02-05', checkOut: '2024-02-07', totalAmount: 1600, status: 'completed' },
];

const ACTIVITY_LOG = [
  { icon: '🏡', text: 'Booked Nature Nest Homestay',      points: '+20 pts', date: 'Mar 10' },
  { icon: '🎨', text: 'Purchased Dokra Art Figurine',      points: '+10 pts', date: 'Feb 28' },
  { icon: '✍️', text: 'Wrote a travel review',            points: '+5 pts',  date: 'Feb 20' },
  { icon: '🏡', text: 'Booked Eco River View',            points: '+20 pts', date: 'Feb 5'  },
];

function StatCard({ value, label, icon, color }) {
  return (
    <div className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4`}>
      <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-dark">{value}</p>
        <p className="text-gray-500 text-sm">{label}</p>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, logout, ecoPoints } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [activeTab, setActiveTab] = useState('bookings');
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.name || '');

  useEffect(() => {
    getMyBookings()
      .then(({ data }) => { if (data.length > 0) setBookings(data); })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const roleStyle = ROLE_COLORS[user?.role] || ROLE_COLORS.User;
  const initials = (user?.name || 'U').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-light">
      {/* Hero banner */}
      <div className="bg-gradient-to-r from-primary to-green-700 pt-16 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center sm:items-end gap-6 relative z-10">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="w-24 h-24 rounded-2xl bg-accent flex items-center justify-center text-dark text-3xl font-black shadow-xl flex-shrink-0"
          >
            {initials}
          </motion.div>
          <div className="text-white text-center sm:text-left">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full mb-2 inline-block ${roleStyle.bg} ${roleStyle.text}`}>
              {user?.role}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold">{user?.name}</h1>
            <p className="text-green-200 text-sm mt-1 flex items-center gap-1 justify-center sm:justify-start">
              <Mail size={13} /> {user?.email}
            </p>
          </div>
          <div className="sm:ml-auto">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/10 backdrop-blur text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/20 transition-colors border border-white/20"
            >
              <LogOut size={15} /> Log Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-12 pb-16">
        {/* Stats row */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <StatCard
            value={ecoPoints ?? user?.ecoPoints ?? 0}
            label="Eco-Points"
            icon={<Leaf size={22} className="text-green-600" />}
            color="bg-green-50"
          />
          <StatCard
            value={bookings.length}
            label="Total Bookings"
            icon={<Calendar size={22} className="text-purple-600" />}
            color="bg-purple-50"
          />
          <StatCard
            value={user?.role}
            label="Account Type"
            icon={<Shield size={22} className="text-blue-600" />}
            color="bg-blue-50"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          {['bookings', 'activity', 'settings'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 font-medium capitalize transition-all border-b-2 -mb-px ${
                activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {tab === 'bookings' ? '🏡 My Bookings' : tab === 'activity' ? '📊 Activity' : '⚙️ Settings'}
            </button>
          ))}
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
                <MapPin size={40} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg">No bookings yet</p>
                <a href="/homestays" className="text-secondary text-sm mt-2 inline-block hover:underline">Browse Homestays →</a>
              </div>
            ) : bookings.map((b) => (
              <motion.div key={b._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <MapPin size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-dark">{b.homestayId?.name}</p>
                    <p className="text-gray-400 text-sm">{b.homestayId?.location}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {b.checkIn} → {b.checkOut}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    b.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                    b.status === 'completed' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {b.status}
                  </span>
                  <span className="font-bold text-dark">₹{b.totalAmount}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="space-y-3">
            {ACTIVITY_LOG.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-medium text-dark text-sm">{item.text}</p>
                    <p className="text-gray-400 text-xs">{item.date}</p>
                  </div>
                </div>
                <span className="font-bold text-secondary text-sm">{item.points}</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
            <h3 className="font-bold text-lg text-dark">Account Settings</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={!editing}
                    className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-gray-50 disabled:text-gray-400"
                  />
                </div>
                {!editing ? (
                  <button onClick={() => setEditing(true)}
                    className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 text-sm font-medium">
                    <Edit3 size={15} /> Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(false)}
                      className="flex items-center gap-1 px-3 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 text-sm">
                      <Check size={15} />
                    </button>
                    <button onClick={() => { setEditing(false); setDisplayName(user?.name || ''); }}
                      className="flex items-center gap-1 px-3 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 text-sm">
                      <X size={15} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={user?.email || ''} disabled
                  className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed" />
              </div>
              <p className="text-gray-400 text-xs mt-1">Email cannot be changed.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Role</label>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm ${roleStyle.bg} ${roleStyle.text}`}>
                <Shield size={14} /> {user?.role}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
              >
                <LogOut size={16} /> Sign Out of ATITHIGRAM
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
