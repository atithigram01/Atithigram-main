import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Gift, Trophy, Star, ArrowUpRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ACTIONS = [
  { icon: <Leaf size={22} className="text-green-600" />,   action: 'Visit an Adventure Spot',      points: 20, bg: 'bg-green-50'  },
  { icon: <Star size={22} className="text-yellow-600" />,  action: 'Explore Geotagged Tourist Spots', points: 15, bg: 'bg-yellow-50' },
  { icon: <Trophy size={22} className="text-purple-600" />,action: 'Write a Travel Review',        points: 5,  bg: 'bg-purple-50' },
  { icon: <Gift size={22} className="text-blue-600" />,    action: 'Refer a Friend',               points: 10, bg: 'bg-blue-50'  },
];

const REWARDS = [
  { title: 'Free Guided Tour',         cost: 100, icon: '🗺️' },
  { title: 'Tree Planted in Your Name', cost: 30,  icon: '🌳' },
];

export default function Rewards() {
  const { user, ecoPoints, addEcoPoints } = useAuth();
  const points = ecoPoints ?? user?.ecoPoints ?? 0;
  const [redeemed, setRedeemed] = useState([]);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleRedeem = (reward) => {
    if (points >= reward.cost && !redeemed.includes(reward.title)) {
      addEcoPoints?.(-reward.cost);
      setRedeemed((prev) => [...prev, reward.title]);
      showToast(`🎉 "${reward.title}" redeemed successfully!`);
    }
  };

  const handleSimulateEarn = (pts) => {
    addEcoPoints?.(pts);
    showToast(`🌱 +${pts} Eco-Points added!`);
  };

  return (
    <div className="min-h-screen bg-light">
      {/* Toast */}
      {toastMsg && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl font-medium text-sm flex items-center gap-2"
        >
          <CheckCircle size={16} /> {toastMsg}
        </motion.div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-500 text-white py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative inline-flex items-center gap-2 bg-white/20 px-5 py-2 rounded-full text-lg font-semibold mb-4"
        >
          <Leaf size={20} /> Eco-Points Program
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold mb-3 relative">Travel Responsibly. Earn Rewards.</h1>
        <p className="text-green-100 text-lg relative">Every sustainable choice earns you points to redeem for exclusive benefits.</p>

        {/* Points Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 inline-block bg-white text-primary px-12 py-6 rounded-2xl shadow-xl relative"
        >
          <motion.p
            key={points}
            initial={{ scale: 1.3, color: '#22c55e' }}
            animate={{ scale: 1, color: '#14532d' }}
            className="text-6xl font-black"
          >
            {points}
          </motion.p>
          <p className="text-sm font-medium text-gray-500 mt-1">Your Eco-Points</p>
          {!user && (
            <p className="text-xs text-gray-400 mt-2">
              <a href="/login" className="underline text-secondary">Sign in</a> to save your points
            </p>
          )}
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-14">
        {/* Earn section */}
        <h2 className="text-3xl font-bold mb-2 text-center text-dark">How to Earn</h2>
        <p className="text-center text-gray-500 mb-8">Click any action below to simulate earning points (demo mode)</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-16">
          {ACTIONS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleSimulateEarn(item.points)}
              className={`flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer`}
            >
              <div className={`p-3 rounded-xl ${item.bg} flex-shrink-0`}>{item.icon}</div>
              <div className="flex-1">
                <p className="font-semibold text-dark">{item.action}</p>
                <p className="text-gray-400 text-xs mt-0.5">Click to simulate earning</p>
              </div>
              <span className="font-bold text-secondary text-sm bg-green-50 px-3 py-1.5 rounded-full">+{item.points} pts</span>
            </motion.div>
          ))}
        </div>

        {/* Redeem section */}
        <h2 className="text-3xl font-bold mb-2 text-center text-dark">Redeem Rewards</h2>
        <p className="text-center text-gray-500 mb-8">
          You have <strong className="text-primary">{points} pts</strong> to spend
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {REWARDS.map((reward, i) => {
            const canRedeem = points >= reward.cost && !redeemed.includes(reward.title);
            const alreadyRedeemed = redeemed.includes(reward.title);
            return (
              <motion.div
                key={i}
                whileHover={{ y: alreadyRedeemed ? 0 : -5 }}
                className={`bg-white rounded-2xl p-6 shadow-sm border text-center transition-all ${
                  alreadyRedeemed ? 'border-green-200 bg-green-50' : 'border-gray-100 hover:shadow-md'
                }`}
              >
                <div className="text-4xl mb-3">{alreadyRedeemed ? '✅' : reward.icon}</div>
                <h3 className="font-bold text-dark mb-2">{reward.title}</h3>
                <p className={`font-semibold text-sm mb-4 ${canRedeem || alreadyRedeemed ? 'text-primary' : 'text-gray-400'}`}>
                  {reward.cost} pts
                </p>
                {/* Progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                  <div
                    className="bg-secondary h-1.5 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (points / reward.cost) * 100)}%` }}
                  />
                </div>
                <button
                  onClick={() => handleRedeem(reward)}
                  disabled={!canRedeem}
                  className={`w-full py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1 ${
                    alreadyRedeemed
                      ? 'bg-green-500 text-white cursor-default'
                      : canRedeem
                        ? 'bg-primary text-white hover:bg-green-900'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {alreadyRedeemed ? 'Redeemed ✓' : <>Redeem <ArrowUpRight size={14} /></>}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Tips */}
        <div className="mt-16 bg-gradient-to-r from-primary to-green-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">🌍 Your Impact</h3>
          <p className="text-green-200 mb-6 max-w-xl mx-auto">
            Every Eco-Point you earn represents a sustainable choice that directly benefits Jharkhand's local communities, forests, and tribal artisans.
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { val: `${Math.floor(points / 30)}`, label: 'Trees Planted' },
              { val: `${points * 5} km`, label: 'Green Travel (km)' },
              { val: `${points * 2} kg`, label: 'CO₂ Offset' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-black text-accent">{s.val}</p>
                <p className="text-green-200 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
