import React from 'react';
import { motion } from 'framer-motion';
import { Phone, AlertTriangle, Shield, MapPin } from 'lucide-react';

const CONTACTS = [
  { icon: '🚨', title: 'Police Emergency', number: '100', color: 'bg-red-50 border-red-200' },
  { icon: '🏥', title: 'Medical Emergency', number: '108', color: 'bg-blue-50 border-blue-200' },
  { icon: '🔥', title: 'Fire Brigade', number: '101', color: 'bg-orange-50 border-orange-200' },
  { icon: '🌲', title: 'Forest Helpline', number: '1800-180-5577', color: 'bg-green-50 border-green-200' },
  { icon: '👮', title: 'Tourism Police Ranchi', number: '0651-2208628', color: 'bg-purple-50 border-purple-200' },
  { icon: '📞', title: 'ATITHIGRAM Support', number: '+91-9955964084', color: 'bg-yellow-50 border-yellow-200' },
];

const TIPS = [
  'Carry a local SIM card with network coverage for remote areas.',
  'Inform your host before heading to a jungle or waterfall.',
  'Download offline maps of Jharkhand before leaving city limits.',
  'Carry a basic first-aid kit when visiting Betla or Saranda forest.',
  'Respect tribal customs — always ask before photographing people or ceremonies.',
];

export default function Emergency() {
  return (
    <div className="min-h-screen bg-light">
      <div className="bg-gradient-to-r from-red-700 to-red-500 text-white py-16 px-4 text-center">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold mb-4">
          Emergency Help
        </motion.h1>
        <p className="text-red-100 text-lg">Stay safe while exploring Jharkhand. Help is always a call away.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-14">
        <h2 className="text-3xl font-bold mb-8 text-center">Emergency Contacts</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {CONTACTS.map((contact, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`border-2 rounded-2xl p-6 ${contact.color} cursor-pointer transition-all`}>
              <div className="text-4xl mb-3">{contact.icon}</div>
              <h3 className="font-bold text-dark text-lg">{contact.title}</h3>
              <a href={`tel:${contact.number}`}
                className="flex items-center gap-2 mt-2 text-primary font-bold text-xl hover:underline">
                <Phone size={18} /> {contact.number}
              </a>
            </motion.div>
          ))}
        </div>

        <h2 className="text-3xl font-bold mb-8 text-center">Safety Tips</h2>
        <div className="space-y-4">
          {TIPS.map((tip, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="bg-amber-100 p-2 rounded-full mt-0.5"><AlertTriangle size={18} className="text-amber-600" /></div>
              <p className="text-gray-700 leading-relaxed">{tip}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
