import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Map, ShoppingBag, Home, CheckCircle, XCircle,
  Settings, BarChart3, Clock, TrendingUp, Eye, RefreshCw,
} from 'lucide-react';
import { getAdminStats, getAdminUsers, getHomestays, getProducts, verifyHomestay } from '../services/api';

const STATS = [
  { label: 'Total Users',      value: '1,284', change: '+12%', icon: <Users size={22} className="text-blue-500" />,   bg: 'bg-blue-50'   },
  { label: 'Tourist Places',   value: '42',    change: '+3',   icon: <Map size={22} className="text-green-500" />,   bg: 'bg-green-50'  },
  { label: 'Homestays',        value: '28',    change: '+5',   icon: <Home size={22} className="text-purple-500" />, bg: 'bg-purple-50' },
  { label: 'Products Listed',  value: '157',   change: '+23',  icon: <ShoppingBag size={22} className="text-amber-500" />, bg: 'bg-amber-50' },
];

const REVENUE = [
  { label: 'Homestay Commissions (25%)', value: '₹48,250', trend: '+18%', color: 'text-green-700' },
  { label: 'Product Platform Fees (20%)', value: '₹22,400', trend: '+7%',  color: 'text-blue-700'  },
  { label: 'Total Revenue',              value: '₹70,650', trend: '+14%', color: 'text-dark', bold: true },
];

const INIT_HOMESTAYS = [
  { id: 1, name: 'Palaash Retreat',    location: 'Jamshedpur', host: 'Arjun Singh',  submittedDate: '2024-01-15', status: 'pending' },
  { id: 2, name: 'Koina Forest Home',  location: 'Lohardaga',  host: 'Priya Kujur',  submittedDate: '2024-01-14', status: 'pending' },
  { id: 3, name: 'Marang Buru Stay',   location: 'Simdega',    host: 'Shyam Oraon',  submittedDate: '2024-01-13', status: 'pending' },
];

const INIT_SELLERS = [
  { id: 1, name: 'Dokra Craft Studio', seller: 'Mohan Das',   product: 'Dokra Figurines', pending: 3, status: 'pending' },
  { id: 2, name: 'Tribal Silk House',  seller: 'Rekha Kumari', product: 'Tussar Saris',   pending: 5, status: 'pending' },
];

const MOCK_USERS = [
  { id: 1, name: 'Arjun Singh',  email: 'arjun@email.com',  role: 'Host',   joined: '2024-01-10', points: 120 },
  { id: 2, name: 'Priya Kujur',  email: 'priya@email.com',  role: 'Seller', joined: '2024-01-09', points: 85  },
  { id: 3, name: 'Ravi Kumar',   email: 'ravi@email.com',   role: 'User',   joined: '2024-01-08', points: 45  },
  { id: 4, name: 'Sneha Oraon',  email: 'sneha@email.com',  role: 'User',   joined: '2024-01-07', points: 200 },
  { id: 5, name: 'Mohan Das',    email: 'mohan@email.com',  role: 'Seller', joined: '2024-01-06', points: 30  },
];

const ROLE_BADGE = {
  Admin:  'bg-red-100 text-red-700',
  Host:   'bg-purple-100 text-purple-700',
  Seller: 'bg-amber-100 text-amber-700',
  User:   'bg-blue-100 text-blue-700',
};

export default function AdminDashboard() {
  const [homestays, setHomestays] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Load real data from DB
    Promise.all([
      getAdminStats().catch(() => ({ data: { users: 0, homestays: 0, products: 0, bookings: 0 }})),
      getHomestays().catch(() => ({ data: [] })),
      getProducts().catch(() => ({ data: [] })),
      getAdminUsers().catch(() => ({ data: [] })),
    ]).then(([stRes, hRes, pRes, uRes]) => {
      setStats(stRes.data);
      
      const mappedHomestays = hRes.data.map(h => ({
        id: h._id,
        name: h.name,
        location: h.location,
        host: h.hostId?.name || 'Unknown',
        submittedDate: new Date(h.createdAt || Date.now()).toISOString().split('T')[0],
        status: h.isVerified ? 'approved' : 'pending'
      }));
      setHomestays(mappedHomestays);

      const mappedSellers = pRes.data.map(p => ({
        id: p._id,
        name: p.name,
        seller: p.sellerId?.name || 'Unknown',
        product: p.description || 'Product',
        pending: p.isVerified ? 0 : 1,
        status: p.isVerified ? 'approved' : 'pending'
      }));
      setSellers(mappedSellers);

      const mappedUsers = uRes.data.map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role || 'User',
        joined: new Date(u.createdAt || Date.now()).toISOString().split('T')[0],
        points: u.ecoPoints || 0
      }));
      setUsers(mappedUsers);
    });
  }, []);

  const pending_h = homestays.filter((h) => h.status === 'pending').length;
  const pending_s = sellers.filter((s) => s.status === 'pending').length;

  const updateHomestay = (id, status) => {
    verifyHomestay(id, status).then(() => {
      setHomestays((prev) => prev.map((h) => h.id === id ? { ...h, status } : h));
    }).catch(console.error);
  };

  const updateSeller = (id, status) => {
    // To-Do backend route to verify product 
    setSellers((prev) => prev.map((s) => s.id === id ? { ...s, status } : s));
  };

  const TABS = [
    { key: 'overview', label: '📊 Overview' },
    { key: 'homestays', label: `🏡 Homestays ${pending_h > 0 ? `(${pending_h})` : ''}` },
    { key: 'sellers',  label: `🎨 Sellers ${pending_s > 0 ? `(${pending_s})` : ''}` },
    { key: 'users',    label: '👥 Users' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-dark text-white py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage the ATITHIGRAM platform</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-green-500/20 text-green-400 text-xs px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Platform Live
            </div>
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full text-sm">
              <Settings size={16} /> Admin Panel
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {[
            { label: 'Total Users',      value: stats ? stats.users : 0, change: '+12%', icon: <Users size={22} className="text-blue-500" />,   bg: 'bg-blue-50'   },
            { label: 'Homestays',        value: stats ? stats.homestays : 0, change: '+5',   icon: <Home size={22} className="text-purple-500" />, bg: 'bg-purple-50' },
            { label: 'Products Listed',  value: stats ? stats.products : 0, change: '+23',  icon: <ShoppingBag size={22} className="text-amber-500" />, bg: 'bg-amber-50' },
            { label: 'Bookings',         value: stats ? stats.bookings : 0, change: '+8%',  icon: <CheckCircle size={22} className="text-green-500" />,   bg: 'bg-green-50'  },
          ].map((stat, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`inline-flex p-3 rounded-xl ${stat.bg}`}>{stat.icon}</div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <p className="text-3xl font-bold text-dark">{stat.value}</p>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-gray-200 overflow-x-auto">
          {TABS.map(({ key, label }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`px-5 py-3 font-medium text-sm transition-all border-b-2 -mb-px whitespace-nowrap ${
                activeTab === key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* ── Overview Tab ── */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Revenue */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
                <BarChart3 size={18} className="text-primary" /> Revenue Snapshot
              </h3>
              <div className="space-y-4">
                {REVENUE.map((r, i) => (
                  <div key={i} className={`flex justify-between items-center py-2 ${i < REVENUE.length - 1 ? 'border-b border-gray-50' : 'border-t border-gray-100 pt-3'}`}>
                    <span className={`text-sm ${r.bold ? 'font-bold text-dark' : 'text-gray-500'}`}>{r.label}</span>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold ${r.color} bg-green-50 px-2 py-0.5 rounded-full`}>↑ {r.trend}</span>
                      <span className={`font-semibold ${r.bold ? 'text-lg' : ''}`}>{r.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
                <Clock size={18} className="text-amber-500" /> Pending Actions
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-xl">
                  <span className="text-gray-600 text-sm">Homestays pending review</span>
                  <span className="bg-red-100 text-red-600 font-bold px-3 py-1 rounded-full text-sm">{pending_h}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-amber-50 rounded-xl">
                  <span className="text-gray-600 text-sm">Sellers pending verification</span>
                  <span className="bg-amber-100 text-amber-600 font-bold px-3 py-1 rounded-full text-sm">{pending_s}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                  <span className="text-gray-600 text-sm">Total registered users</span>
                  <span className="bg-blue-100 text-blue-600 font-bold px-3 py-1 rounded-full text-sm">{users.length}</span>
                </div>
              </div>
              {(pending_h > 0 || pending_s > 0) && (
                <button onClick={() => setActiveTab(pending_h > 0 ? 'homestays' : 'sellers')}
                  className="w-full mt-4 bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-900 transition-colors flex items-center justify-center gap-2">
                  <Eye size={14} /> Review Pending Items
                </button>
              )}
            </div>

            {/* Quick actions */}
            <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-secondary" /> Platform Health
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                {[
                  { label: 'Uptime', value: '99.9%', color: 'text-green-600' },
                  { label: 'Avg Response', value: '1.2s', color: 'text-blue-600' },
                  { label: 'Bookings Today', value: '7', color: 'text-purple-600' },
                  { label: 'Orders Today', value: '12', color: 'text-amber-600' },
                ].map((m, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4">
                    <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
                    <p className="text-gray-500 mt-1">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Homestays Tab ── */}
        {activeTab === 'homestays' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-700">Homestay Verification Queue</h3>
              <span className="text-xs text-gray-400">{homestays.length} total • {pending_h} pending</span>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Homestay', 'Host', 'Submitted', 'Status', 'Action'].map((h) => (
                    <th key={h} className={`text-left px-6 py-4 text-sm font-semibold text-gray-600 ${h === 'Action' ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {homestays.map((h) => (
                  <tr key={h.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-dark">{h.name}</p>
                      <p className="text-xs text-gray-400">{h.location}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{h.host}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{h.submittedDate}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        h.status === 'approved' ? 'bg-green-100 text-green-700' :
                        h.status === 'rejected' ? 'bg-red-100 text-red-600' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {h.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {h.status === 'pending' ? (
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => updateHomestay(h.id, 'approved')}
                            className="flex items-center gap-1 bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                            <CheckCircle size={13} /> Approve
                          </button>
                          <button onClick={() => updateHomestay(h.id, 'rejected')}
                            className="flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                            <XCircle size={13} /> Reject
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end">
                          <button onClick={() => updateHomestay(h.id, 'pending')}
                            className="flex items-center gap-1 bg-gray-50 text-gray-500 hover:bg-gray-100 px-3 py-1.5 rounded-lg text-xs transition-colors">
                            <RefreshCw size={12} /> Reset
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Sellers Tab ── */}
        {activeTab === 'sellers' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-700">Seller Verification Queue</h3>
              <span className="text-xs text-gray-400">{sellers.length} total • {pending_s} pending</span>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Shop Name', 'Seller', 'Products Pending', 'Status', 'Action'].map((h) => (
                    <th key={h} className={`text-left px-6 py-4 text-sm font-semibold text-gray-600 ${h === 'Action' ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sellers.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-dark">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.product}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{s.seller}</td>
                    <td className="px-6 py-4">
                      <span className="bg-amber-100 text-amber-700 font-bold px-3 py-1 rounded-full text-xs">
                        {s.pending} products
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        s.status === 'approved' ? 'bg-green-100 text-green-700' :
                        s.status === 'rejected' ? 'bg-red-100 text-red-600' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {s.status === 'pending' ? (
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => updateSeller(s.id, 'approved')}
                            className="flex items-center gap-1 bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                            <CheckCircle size={13} /> Verify
                          </button>
                          <button onClick={() => updateSeller(s.id, 'rejected')}
                            className="flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                            <XCircle size={13} /> Reject
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end">
                          <button onClick={() => updateSeller(s.id, 'pending')}
                            className="flex items-center gap-1 bg-gray-50 text-gray-500 hover:bg-gray-100 px-3 py-1.5 rounded-lg text-xs transition-colors">
                            <RefreshCw size={12} /> Reset
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Users Tab ── */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-700">Registered Users</h3>
              <span className="text-xs text-gray-400">{users.length} users</span>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['User', 'Email', 'Role', 'Eco-Points', 'Joined'].map((h) => (
                    <th key={h} className="text-left px-6 py-4 text-sm font-semibold text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                          {u.name[0]}
                        </div>
                        <span className="font-medium text-dark text-sm">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ROLE_BADGE[u.role] || 'bg-gray-100 text-gray-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-green-600 font-semibold text-sm">🌱 {u.points}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{u.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
