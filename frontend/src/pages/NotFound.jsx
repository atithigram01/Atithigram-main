import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, MapPin, Leaf } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-green-800 to-dark flex items-center justify-center px-4">
      <div className="text-center text-white max-w-lg">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <span className="text-[10rem] font-black leading-none text-white/10 select-none">404</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-accent/20 backdrop-blur-sm rounded-full p-6 border border-accent/30">
                <MapPin size={64} className="text-accent" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl font-bold mb-4">You're Off the Map!</h1>
          <p className="text-green-200 text-lg mb-8 leading-relaxed">
            This trail doesn't exist in our guide. The page you're looking for has wandered into the Jharkhand forests.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 bg-accent text-dark px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-400 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Home size={20} /> Back to Home
            </Link>
            <Link
              to="/places"
              className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-white/20 transition-all border border-white/20"
            >
              <Leaf size={20} /> Explore Places
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-green-300/50 text-sm"
        >
          🌿 ATITHIGRAM · Jharkhand Tourism Platform
        </motion.div>
      </div>
    </div>
  );
}
