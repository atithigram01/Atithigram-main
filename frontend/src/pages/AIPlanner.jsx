import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Loader2, RotateCcw } from 'lucide-react';
import { askAI } from '../services/api';

// Mock AI responses with rich Jharkhand knowledge
const MOCK_RESPONSES = {
  default: "Johar! 🙏 I'm your ATITHIGRAM travel assistant. Ask me about places, itineraries, tribal culture, or homestays!",
  greet: "Johar! 🙏 Welcome to Jharkhand's tourism guide. Where would you like to explore today?",
  waterfall: "Jharkhand has stunning waterfalls! 🌊\n\n• **Hundru Falls** (98m) near Ranchi\n• **Jonha Falls** — sacred waterfall near Ranchi\n• **Dasam Falls** — scenic falls in Seraikela-Kharsawan\n• **Hirni Falls** — lush forested escape\n\nBest visited October–February for clear skies and full flow!",
  temple: "Jharkhand has ancient temples! 🛕\n\n• **Baidyanath Dham**, Deoghar (Jyotirlinga)\n• **Jagannath Temple**, Ranchi\n• **Rajrappa Temple** (Chhinnamastika Devi shrine)\n• **Pahari Mandir** overlooking Ranchi city\n\nBest during Shivratri or Diwali for a spiritual experience!",
  tribal: "Jharkhand is home to rich tribal cultures! 🌿\n\n• **Santal tribe** — largest tribal group, famous for Sohrai art\n• **Oraon tribe** — celebrate Sarhul (spring festival)\n• **Munda tribe** — known for vibrant Ho music\n• **Birsa Munda Museum**, Ranchi is a must-visit\n\nTip: Plan your trip around *Sarhul* (March–April) for cultural immersion!",
  itinerary: "Here's a perfect **5-Day Jharkhand Itinerary** ✈️\n\n**Day 1 — Ranchi:** Ranchi Lake, Pahari Mandir, Jagannath Temple\n**Day 2 — Waterfalls:** Hundru Falls, Jonha Falls, Dasam Falls\n**Day 3 — Betla:** National Park Safari, Forest Homestay\n**Day 4 — Deoghar:** Baidyanath Dham, local bazaar\n**Day 5 — Tribal Culture:** Santal Heritage Village, Dokra Art Workshop\n\n🌱 Eco-points earned: **50 points** on this trip!",
  homestay: "ATITHIGRAM has verified homestays across Jharkhand:\n\n• **Nature Nest** — Netarhat, ₹1,200/night ⭐ 4.9\n• **Santal Heritage House** — Dumka, ₹900/night ⭐ 4.7\n• **Forest Retreat** — Betla, ₹1,500/night ⭐ 5.0\n• **Eco River View** — Koderma, ₹800/night ⭐ 4.6\n\nAll admin-verified ✅ — booking directly supports host families! 🏡",
  handicraft: "Jharkhand's handicrafts are world-famous! 🎨\n\n• **Dokra Art** — ancient lost-wax metal casting\n• **Paitkar Paintings** — tribal scroll art\n• **Kantha Embroidery** — intricate textile work\n• **Sabai Grass Weaving** — eco-friendly baskets\n• **Tussar Silk** — premium natural silk\n\nVisit our Handicrafts Marketplace to shop directly from artisans!",
  ecopoints: "🌱 **Eco-Points System:**\n\nEarn points for sustainable choices:\n• Book a verified homestay → **+20 pts**\n• Buy from local artisans → **+10 pts per item**\n• Refer a friend → **+15 pts**\n• Write a travel review → **+5 pts**\n\nRedeem for:\n• 10% off homestays (50 pts)\n• Free guided tour (100 pts)\n• Exclusive artisan gift (80 pts)\n• Priority booking (30 pts)\n\nHelping protect Jharkhand's nature! 💚",
  budget: "Here's a **Budget Guide for Jharkhand** 💰\n\n**Budget Travel (₹1,000–2,000/day):**\n• Homestays from ₹800/night\n• Local dhabas for meals (₹100–200)\n\n**Mid-Range (₹2,000–5,000/day):**\n• Forest retreats, guided safaris\n• Traditional Jharkhand thali\n\n**Best Season:** October to March for ideal weather!\n\n🎒 Tip: Book homestays via ATITHIGRAM and earn Eco-Points on every rupee spent!",
};

function getResponse(message) {
  const lower = message.toLowerCase();
  if (lower.match(/\b(hello|hi|namaste|hey)\b/)) return MOCK_RESPONSES.greet;
  if (lower.match(/waterfall|\bfall\b|\bfalls\b|hundru|jonha|dasam/)) return MOCK_RESPONSES.waterfall;
  if (lower.match(/temple|mandir|baidyanath|jagannath|rajrappa|dewri|deori/)) return MOCK_RESPONSES.temple;
  if (lower.match(/tribal|culture|santal|munda|oraon|festival/)) return MOCK_RESPONSES.tribal;
  if (lower.match(/itinerary|\bplan\b|trip|days|schedule|route/)) return MOCK_RESPONSES.itinerary;
  if (lower.match(/homestay|\bstay\b|accommodation|hotel|host/)) return MOCK_RESPONSES.homestay;
  if (lower.match(/handicraft|craft|\bart\b|dokra|silk|basket/)) return MOCK_RESPONSES.handicraft;
  if (lower.match(/\beco\b|point|reward|sustainable|green/)) return MOCK_RESPONSES.ecopoints;
  if (lower.match(/budget|cost|price|cheap|affordable|money/)) return MOCK_RESPONSES.budget;
  return "That's a great question about Jharkhand! Could you ask about: 🌊 waterfalls, 🛕 temples, 👑 tribal culture, 📅 itinerary planning, 🏡 homestays, 🎨 handicrafts, or 💰 budget tips?";
}

const QUICK_QUESTIONS = [
  'Plan a 5-day itinerary',
  'Best waterfalls to visit',
  'Tell me about tribal culture',
  'How do Eco-Points work?',
  'What is the budget for a trip?',
  'Show me verified homestays',
];

export default function AIPlanner() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: MOCK_RESPONSES.default }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg) return;
    
    // Optimistically add user's message
    setMessages((prev) => [...prev, { role: 'user', text: msg }]);
    setInput('');
    setLoading(true);

    try {
      // Send chat request to backend with current messages history
      const activeHistory = messages.slice(1);
      const { data } = await askAI(msg, activeHistory);
      
      setMessages((prev) => [...prev, { role: 'bot', text: data.response }]);
    } catch (error) {
      console.warn("AI Planner API error, falling back to local mock responses:", error);
      setMessages((prev) => [...prev, { role: 'bot', text: getResponse(msg) }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (q) => {
    sendMessage(q);
  };

  const resetChat = () => {
    setMessages([{ role: 'bot', text: MOCK_RESPONSES.default }]);
    setInput('');
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-primary to-gray-900 flex flex-col">
      {/* Header */}
      <div className="text-center py-10 px-4 text-white">
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="inline-flex items-center gap-3 mb-4 bg-white/10 backdrop-blur px-6 py-3 rounded-full"
        >
          <Sparkles size={22} className="text-accent" />
          <span className="text-lg font-semibold">AI Travel Assistant</span>
        </motion.div>
        <h1 className="text-4xl font-bold">
          Plan Your Perfect <span className="text-accent">Jharkhand</span> Trip
        </h1>
        <p className="text-green-200 mt-3">Powered by smart local knowledge and eco-tourism recommendations</p>
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-2 justify-center px-4 mb-4">
        {QUICK_QUESTIONS.map((q) => (
          <button key={q} onClick={() => handleQuickPrompt(q)}
            className="bg-white/10 backdrop-blur text-white text-sm px-4 py-2 rounded-full hover:bg-white/20 transition-colors border border-white/20 hover:border-accent/50">
            {q}
          </button>
        ))}
      </div>

      {/* Chat area */}
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 pb-4 flex flex-col gap-3 overflow-y-auto" style={{ maxHeight: '50vh' }}>
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'bot' && (
                <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot size={18} className="text-dark" />
                </div>
              )}
              <div className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${msg.role === 'user'
                ? 'bg-secondary text-white rounded-br-none'
                : 'bg-white text-dark rounded-bl-none shadow-md'
                }`}>
                {msg.text}
              </div>
              {msg.role === 'user' && (
                <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User size={18} className="text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center">
              <Bot size={18} className="text-dark" />
            </div>
            <div className="bg-white rounded-2xl rounded-bl-none px-5 py-3 flex items-center gap-2 shadow-md">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div key={i} className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ delay: i * 0.15, repeat: Infinity, duration: 0.7 }} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="max-w-3xl w-full mx-auto px-4 pb-8 pt-2">
        <div className="flex gap-3 bg-white rounded-2xl shadow-xl p-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Ask about places, itineraries, culture..."
            className="flex-1 px-4 py-3 outline-none text-dark placeholder-gray-400 text-sm"
          />
          <button onClick={resetChat}
            title="New conversation"
            className="text-gray-400 hover:text-gray-600 p-3 transition-colors">
            <RotateCcw size={16} />
          </button>
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="bg-primary text-white p-3 rounded-xl hover:bg-green-900 transition-colors flex items-center gap-1 px-5 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-xs text-white/30 mt-2">Press Enter to send · Click a prompt above to try</p>
      </div>
    </div>
  );
}
