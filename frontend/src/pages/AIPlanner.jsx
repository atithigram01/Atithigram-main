import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Loader2, RotateCcw, MapPin, Lightbulb } from 'lucide-react';

// ─── Gemini API Helper ────────────────────────────────────────────────────────
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are "Atithi" 🙏 — the AI travel assistant for ATITHIGRAM, Jharkhand's premier eco-tourism platform.

ABOUT ATITHIGRAM:
- A tourism platform connecting tourists with verified homestays, local artisans, and eco-experiences in Jharkhand, India.
- Features: Map explorer, homestay bookings, handicrafts marketplace, tribal cultural events, emergency contacts, Eco-Points rewards system.
- Eco-Points: Earned by booking homestays (+20 pts), buying from artisans (+10 pts), writing reviews (+5 pts), referring friends (+15 pts). Redeemable for discounts and guided tours.

YOUR KNOWLEDGE BASE — JHARKHAND TOURISM:

POPULAR PLACES:
- Hundru Falls (98m) — near Ranchi, best Oct–Feb
- Jonha Falls — sacred, near Ranchi
- Dasam Falls — on Subarnarekha River, Seraikela-Kharsawan
- Hirni Falls — lush forested escape
- Betla National Park — tigers, elephants, leopards; first national park in Jharkhand
- Ranchi Lake — serene man-made lake, perfect for boating
- Pahari Mandir — hilltop temple overlooking Ranchi city
- Baidyanath Dham, Deoghar — one of the 12 Jyotirlingas of Lord Shiva
- Jagannath Temple, Ranchi — built in 1691, miniature of Puri temple
- Rajrappa Temple — Chhinnamastika Devi shrine, confluence of Damodar and Bhairavi rivers

TRIBAL CULTURE:
- Santal tribe — largest tribal group, famous for Sohrai and Khovar art, Karma festival
- Oraon tribe — celebrate Sarhul (spring festival, March–April), Karma dance
- Munda tribe — known for Sendra festival, Birsa Munda was a great Munda leader
- Ho tribe — vibrant music tradition
- Birsa Munda Museum, Ranchi — must-visit for cultural history
- Key festivals: Sarhul (March–April), Karma (August–September), Tusu (winter), Jawa

HOMESTAYS (via ATITHIGRAM):
- Nature Nest — Netarhat, ₹1,200/night ⭐ 4.9
- Santal Heritage House — Dumka, ₹900/night ⭐ 4.7
- Forest Retreat — Betla, ₹1,500/night ⭐ 5.0
- Eco River View — Koderma, ₹800/night ⭐ 4.6
All homestays are admin-verified ✅ and directly support local host families.

HANDICRAFTS:
- Dokra Art — ancient lost-wax metal casting, from Dhanbad/Hazaribagh region
- Paitkar Paintings — traditional tribal scroll paintings from Amadubi
- Kantha Embroidery — intricate textile work
- Sabai Grass Weaving — eco-friendly baskets and mats
- Tussar Silk — premium natural silk from Bhagalpur region

FOOD:
- Dhuska — rice & lentil fried bread, popular street food
- Rugra — wild mushroom delicacy
- Litti Chokha — baked wheat balls with roasted eggplant/tomato chutney
- Handia — traditional rice beer of the tribal communities
- Thekua — sweet fried cookie, offered during Chhath Puja
- Bamboo shoot curries — Santal tribal cuisine

TRAVEL INFO:
- Best season: October to March (cool, clear weather)
- Monsoon (July–September): Waterfalls at peak, roads can be difficult
- Summer (April–June): Hot, some waterfalls dry up
- Nearest airports: Birsa Munda Airport (Ranchi), Deoghar Airport
- Language: Hindi, Santali, Bengali, Nagpuri (Sadri)

BUDGET GUIDE:
- Budget (₹1,000–2,000/day): Homestays from ₹800/night, local dhabas ₹100–200/meal
- Mid-range (₹2,000–5,000/day): Eco-retreats, guided safaris, Jharkhand thali
- Premium (₹5,000+/day): Luxury resorts, private guides, helicopter tours

SAMPLE ITINERARIES:
3-Day Quick: Ranchi sightseeing → Hundru/Jonha Falls → Betla Safari
5-Day Classic: Ranchi → Waterfalls → Betla NP → Deoghar → Tribal Village
7-Day Immersive: Above + Netarhat → Hazaribagh → Paitkar village → Dumka

EMERGENCY INFO:
- Jharkhand Tourism: 1800-345-6645 (toll-free)
- Ranchi Police: 0651-2208066
- Emergency Ambulance: 108
- Tourist Helpline: 1363

YOUR PERSONALITY & RULES:
- Friendly, enthusiastic, knowledgeable local guide energy
- Use relevant emojis to make responses engaging
- Use **bold** for important items and bullet points for lists
- Respond in English, but can greet in "Johar!" (traditional Jharkhand greeting)
- Keep responses concise but informative (3–8 sentences or a structured list)
- Always encourage eco-friendly travel and mention ATITHIGRAM's services when relevant
- If asked something outside Jharkhand tourism, politely redirect to tourism topics
- Never share fake information — if unsure, say so and suggest verifying locally`;

async function callGemini(conversationHistory) {
  const contents = conversationHistory.map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));

  // Prepend a user/model exchange to inject the system prompt
  const systemContents = [
    { role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\nUnderstood? Please introduce yourself briefly.' }] },
    { role: 'model', parts: [{ text: "Johar! 🙏 I'm Atithi, your ATITHIGRAM travel guide for Jharkhand! I'm here to help you discover amazing places, plan itineraries, find homestays, and explore the incredible tribal culture of this beautiful state. What would you like to explore today?" }] },
    ...contents,
  ];

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: systemContents,
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 600,
        topP: 0.95,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || 'Gemini API error');
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
}

// ─── Markdown-lite renderer ──────────────────────────────────────────────────
function renderMarkdown(text) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Bold: **text**
    const boldified = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    if (line.startsWith('• ') || line.startsWith('- ')) {
      return <li key={i} className="ml-4 list-disc" dangerouslySetInnerHTML={{ __html: boldified.replace(/^[•\-]\s*/, '') }} />;
    }
    if (line.trim() === '') return <br key={i} />;
    return <p key={i} dangerouslySetInnerHTML={{ __html: boldified }} />;
  });
}

// ─── Quick questions ──────────────────────────────────────────────────────────
const QUICK_QUESTIONS = [
  '🗺️ Plan a 5-day itinerary',
  '🌊 Best waterfalls to visit',
  '🎭 Tell me about tribal culture',
  '🌱 How do Eco-Points work?',
  '💰 What is the budget for a trip?',
  '🏡 Show me verified homestays',
  '🍲 What food should I try?',
  '📅 Best time to visit Jharkhand',
];

// ─── Initial greeting ─────────────────────────────────────────────────────────
const INITIAL_MESSAGE = {
  role: 'bot',
  text: "Johar! 🙏 I'm **Atithi**, your ATITHIGRAM AI travel guide for Jharkhand!\n\nI can help you with:\n• 🗺️ Trip planning & itineraries\n• 🌊 Places, waterfalls & temples\n• 🎭 Tribal culture & festivals\n• 🏡 Homestay recommendations\n• 🎨 Handicrafts & local food\n• 💰 Budget & travel tips\n\nWhat would you like to explore today?",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function AIPlanner() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    const userMsg = { role: 'user', text: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError(null);

    // Build conversation history (exclude initial greeting from API call)
    const history = [...messages.slice(1), userMsg].map((m) => ({
      role: m.role === 'user' ? 'user' : 'bot',
      text: m.text,
    }));

    try {
      const reply = await callGemini(history);
      setMessages((prev) => [...prev, { role: 'bot', text: reply }]);
    } catch (err) {
      console.error('Gemini error:', err);
      setError(err.message);
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: "⚠️ I'm having trouble connecting right now. Please check your API key or try again in a moment!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setInput('');
    setError(null);
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-green-900 to-gray-900 flex flex-col">
      {/* Header */}
      <div className="text-center py-10 px-4 text-white">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="inline-flex items-center gap-3 mb-4 bg-white/10 backdrop-blur px-6 py-3 rounded-full"
        >
          <Sparkles size={22} className="text-yellow-400" />
          <span className="text-lg font-semibold">Powered by Google Gemini AI</span>
        </motion.div>
        <h1 className="text-4xl font-bold">
          Meet <span className="text-yellow-400">Atithi</span> — Your AI Guide
        </h1>
        <p className="text-green-200 mt-3">
          Ask anything about Jharkhand — places, culture, itineraries, homestays, food & more
        </p>
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-2 justify-center px-4 mb-6 max-w-4xl mx-auto">
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => sendMessage(q)}
            disabled={loading}
            className="bg-white/10 backdrop-blur text-white text-sm px-4 py-2 rounded-full hover:bg-white/25 transition-all border border-white/20 hover:border-yellow-400/50 hover:scale-105 disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat area */}
      <div
        className="flex-1 max-w-3xl w-full mx-auto px-4 pb-4 flex flex-col gap-4 overflow-y-auto"
        style={{ maxHeight: '52vh' }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'bot' && (
                <div className="h-9 w-9 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                  <Bot size={18} className="text-gray-900" />
                </div>
              )}
              <div
                className={`max-w-[82%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-green-600 text-white rounded-br-none shadow-md'
                    : 'bg-white text-gray-800 rounded-bl-none shadow-lg'
                }`}
              >
                {msg.role === 'bot' ? (
                  <div className="space-y-1">{renderMarkdown(msg.text)}</div>
                ) : (
                  msg.text
                )}
              </div>
              {msg.role === 'user' && (
                <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <User size={18} className="text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="h-9 w-9 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg">
              <Bot size={18} className="text-gray-900" />
            </div>
            <div className="bg-white rounded-2xl rounded-bl-none px-5 py-4 flex items-center gap-2 shadow-lg">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2.5 h-2.5 bg-green-500 rounded-full"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ delay: i * 0.18, repeat: Infinity, duration: 0.75 }}
                />
              ))}
              <span className="text-xs text-gray-400 ml-2">Atithi is thinking...</span>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Error banner */}
      {error && (
        <div className="max-w-3xl mx-auto px-4 mb-2">
          <div className="bg-red-500/20 border border-red-400/40 text-red-200 text-xs rounded-xl px-4 py-2 text-center">
            ⚠️ API Error: {error}. Check your VITE_GEMINI_API_KEY in frontend/.env
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="max-w-3xl w-full mx-auto px-4 pb-10 pt-2">
        <div className="flex gap-3 bg-white rounded-2xl shadow-2xl p-2 border border-white/30">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Ask Atithi about Jharkhand travel..."
            className="flex-1 px-4 py-3 outline-none text-gray-800 placeholder-gray-400 text-sm bg-transparent"
            disabled={loading}
          />
          <button
            onClick={resetChat}
            title="New conversation"
            className="text-gray-400 hover:text-gray-600 p-3 transition-colors rounded-xl hover:bg-gray-100"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="bg-green-700 text-white p-3 rounded-xl hover:bg-green-800 transition-all flex items-center gap-2 px-5 disabled:opacity-40 shadow-lg hover:shadow-green-700/40 hover:scale-105"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
        <p className="text-center text-xs text-white/30 mt-3">
          🌿 Powered by Google Gemini AI · Press Enter to send · Ask anything about Jharkhand!
        </p>
      </div>
    </div>
  );
}
