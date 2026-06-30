import React from 'react';
import { Instagram, Youtube, Facebook, Mail, Phone, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark text-gray-300 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-10">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-2 text-white mb-3 brand-logo-text hover:text-green-50 transition-colors" style={{ fontSize: '1.9rem' }}>
            <img
              src="/logo.png"
              alt="Atithigram Logo"
              style={{ width: 44, height: 44, objectFit: 'contain', mixBlendMode: 'screen' }}
            />
            <span>Atithigram</span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed">
            Promoting sustainable, community-driven eco-tourism in Jharkhand. Discover the unexplored.
          </p>
          <div className="flex gap-3 mt-5">
            <a href="https://www.instagram.com/atithigram?igsh=ZGdieGR5ZGQ1dWV0" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors"><Instagram size={18} /></a>
            <a href="https://youtube.com/@atithigram?si=0UCQ-2l0vgJ1vrJV" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors"><Youtube size={18} /></a>
            <a href="https://www.facebook.com/profile.php?id=61578459482160" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors"><Facebook size={18} /></a>
            <a href="https://www.linkedin.com/in/atithigram-in-80106b3b9" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors"><Linkedin size={18} /></a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-white font-semibold mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            {[['Places', '/places'], ['Interactive Map', '/map'], ['Adventure & Fun', '/adventure'] /*, ['Verified Homestays', '/homestays'], ['Tribal Handicrafts', '/handicrafts']*/].map(([label, to]) => (
              <li key={to}><Link to={to} className="hover:text-accent transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Platform */}
        <div>
          <h4 className="text-white font-semibold mb-4">Platform</h4>
          <ul className="space-y-2 text-sm">
            {[['AI Travel Planner', '/planner'], ['Eco Rewards', '/rewards'], ['Emergency Help', '/emergency'], ['Admin Panel', '/admin']].map(([label, to]) => (
              <li key={to}><Link to={to} className="hover:text-accent transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><Mail size={14} /> contact@atithigram.in</li>
            <li className="flex items-center gap-2"><Phone size={14} /> +91-9955964084</li>
          </ul>
          <div className="mt-5 bg-green-900/40 rounded-xl px-4 py-3">
            <p className="text-xs text-green-300 font-medium">🌱 Google AdSense Integration Ready</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-6 text-center text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} ATITHIGRAM. All rights reserved. | Made by 💚 Team Atithigram </p>
      </div>
    </footer>
  );
}
