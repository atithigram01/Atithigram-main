import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  LogOut, 
  User, 
  ChevronDown, 
  MapPin, 
  Map, 
  Compass, 
  Calendar, 
  Sparkles, 
  Gift, 
  AlertTriangle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/places', label: 'Places', icon: MapPin },
  { to: '/map', label: 'Map', icon: Map },
  { to: '/adventure', label: 'Adventure', icon: Compass },
  { to: '/events', label: 'Events', icon: Calendar },
  { to: '/planner', label: 'AI Planner', icon: Sparkles },
  { to: '/rewards', label: 'Rewards', icon: Gift },
  { to: '/emergency', label: 'Emergency', icon: AlertTriangle },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout, ecoPoints } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
    setUserMenuOpen(false);
  };

  return (
    <nav className="bg-primary text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 brand-logo-text text-white hover:text-green-50 transition-colors" style={{ fontSize: '1.9rem' }}>
            <img
              src="/logo.png"
              alt="Atithigram Logo"
              style={{ width: 42, height: 42, objectFit: 'contain' }}
            />
            <span>Atithigram</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  location.pathname === to ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-green-100'
                }`}>
                <Icon size={16} />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Auth — Desktop */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full text-sm transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-accent text-dark font-bold text-xs flex items-center justify-center">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name}</span>
                  <span className="text-accent text-xs font-bold ml-0.5">🌱{ecoPoints}</span>
                  <ChevronDown size={14} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <p className="font-semibold text-dark text-sm truncate">{user.name}</p>
                      <p className="text-gray-400 text-xs truncate">{user.email}</p>
                      <p className="text-green-600 text-xs font-semibold mt-0.5">🌱 {ecoPoints} Eco-Points</p>
                    </div>
                    <Link to="/profile" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <User size={14} /> My Profile
                    </Link>
                    {user.role === 'Admin' && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 transition-colors">
                        ⚙️ Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100">
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-green-100 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link to="/signup"
                  className="bg-accent text-dark px-4 py-2 rounded-full font-semibold text-sm hover:bg-yellow-400 transition-colors">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-white p-1">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-green-900 border-t border-white/10 pb-4 px-4 space-y-1">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2.5 py-2.5 px-3 rounded-lg text-sm hover:bg-white/10 transition-colors ${
                location.pathname === to ? 'bg-white/15 font-medium' : ''
              }`}>
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          ))}
          <div className="pt-3 border-t border-white/10 mt-2">
            {user ? (
              <div className="space-y-1">
                <div className="px-3 py-2 text-sm text-green-200">
                  Signed in as <strong className="text-white">{user.name}</strong>
                  <span className="ml-2 text-accent font-bold">🌱 {ecoPoints} pts</span>
                </div>
                <Link to="/profile" onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 py-2 px-3 text-sm hover:bg-white/10 rounded-lg">
                  <User size={14} /> My Profile
                </Link>
                {user.role === 'Admin' && (
                  <Link to="/admin" onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 py-2 px-3 text-sm text-accent hover:bg-white/10 rounded-lg">
                    ⚙️ Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout}
                  className="w-full text-left py-2 px-3 text-sm text-red-300 hover:bg-white/10 rounded-lg flex items-center gap-2">
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" onClick={() => setIsOpen(false)}
                  className="flex-1 text-center bg-white/10 py-2 rounded-lg text-sm hover:bg-white/20 transition-colors">
                  Sign In
                </Link>
                <Link to="/signup" onClick={() => setIsOpen(false)}
                  className="flex-1 text-center bg-accent text-dark py-2 rounded-lg text-sm font-semibold hover:bg-yellow-400 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
