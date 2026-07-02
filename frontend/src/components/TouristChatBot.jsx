import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2, RotateCcw, Sparkles, Minimize2 } from 'lucide-react';

// ─── Gemini API ───────────────────────────────────────────────────────────────
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are "Atithi" 🙏 — the compact AI travel assistant for ATITHIGRAM, Jharkhand's eco-tourism platform.

KEY FACTS:
- ATITHIGRAM: Platform for homestays, handicrafts, maps, tribal culture, and eco-points in Jharkhand
- Eco-Points: Earn by booking (+20), buying artisan products (+10), reviews (+5), referrals (+15)

TOP PLACES: Hundru Falls (98m), Betla National Park (tigers & elephants), Baidyanath Dham (Jyotirlinga), Ranchi Lake, Jagannath Temple, Dasam Falls, Jonha Falls, Pahari Mandir, Rajrappa Temple

TRIBES: Santal (Sohrai art, Karma festival), Oraon (Sarhul festival March-April), Munda (Birsa Munda legacy), Ho tribe

HOMESTAYS: Nature Nest-Netarhat ₹1200/night, Forest Retreat-Betla ₹1500/night, Santal Heritage House-Dumka ₹900/night, Eco River View-Koderma ₹800/night

HANDICRAFTS: Dokra Art, Paitkar Paintings, Tussar Silk, Sabai Grass Weaving, Kantha Embroidery

FOOD: Dhuska, Rugra (wild mushroom), Litti Chokha, Thekua, Bamboo shoot curry

BEST SEASON: October to March | BUDGET: ₹1000-5000/day | EMERGENCY: 108 (ambulance), 1363 (tourist helpline)

RULES:
- Keep responses SHORT (2-4 sentences or a brief list) — this is a compact chat widget
- Use emojis to be friendly
- Use **bold** for key terms
- Greet with "Johar!" if greeted
- Guide tourists warmly and suggest ATITHIGRAM features (homestays, map, eco-points)
- Redirect non-tourism questions back to Jharkhand travel topics`;

async function callGeminiCompact(conversationHistory) {
  const systemHistory = [
    {
      role: 'user',
      parts: [{ text: SYSTEM_PROMPT + '\n\nReady? Introduce yourself in 1 sentence.' }],
    },
    {
      role: 'model',
      parts: [{ text: "Johar! 🙏 I'm Atithi, your ATITHIGRAM guide for Jharkhand — ask me anything about travel, culture, or homestays!" }],
    },
    ...conversationHistory.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    })),
  ];

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: systemHistory,
      generationConfig: { temperature: 0.75, maxOutputTokens: 250, topP: 0.9 },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || 'API error');
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, try again!';
}

// Simple markdown-lite renderer
function renderText(text) {
  return text.split('\n').map((line, i) => {
    const bold = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    if (line.startsWith('• ') || line.startsWith('- ')) {
      return (
        <li key={i} className="ml-3 list-disc text-xs" dangerouslySetInnerHTML={{ __html: bold.replace(/^[•\-]\s*/, '') }} />
      );
    }
    if (!line.trim()) return null;
    return <p key={i} className="text-xs" dangerouslySetInnerHTML={{ __html: bold }} />;
  });
}

const INITIAL_MSG = {
  role: 'bot',
  text: "Johar! 🙏 I'm **Atithi**, your AI guide for Jharkhand!\n\nAsk me about places 🌊, homestays 🏡, tribal culture 🎭, food 🍲, or trip planning 🗺️!",
};

const QUICK_CHIPS = ['Best waterfalls 🌊', 'Plan my trip 🗺️', 'Show homestays 🏡', 'Local food 🍲'];

export default function TouristChatBot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MSG]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    if (open && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, open, minimized]);

  const sendMessage = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    const userMsg = { role: 'user', text: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const history = [...messages.slice(1), userMsg].map((m) => ({
      role: m.role,
      text: m.text,
    }));

    try {
      const reply = await callGeminiCompact(history);
      setMessages((prev) => [...prev, { role: 'bot', text: reply }]);
      if (!open) setUnread((n) => n + 1);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: '⚠️ Connection issue. Please try again!' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMessages([INITIAL_MSG]);
    setInput('');
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Floating Chat Bubble */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
              style={{ maxHeight: minimized ? '56px' : '520px' }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-700 to-green-600 text-white flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center shadow">
                  <Bot size={16} className="text-gray-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-tight">Atithi — AI Guide</p>
                  <p className="text-xs text-green-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse inline-block" />
                    Powered by Google Gemini
                  </p>
                </div>
                <button
                  onClick={() => setMinimized((m) => !m)}
                  className="text-white/70 hover:text-white p-1 transition-colors"
                  title={minimized ? 'Expand' : 'Minimize'}
                >
                  <Minimize2 size={15} />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="text-white/70 hover:text-white p-1 transition-colors"
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>

              {!minimized && (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-gray-50" style={{ minHeight: 0 }}>
                    <AnimatePresence initial={false}>
                      {messages.map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {msg.role === 'bot' && (
                            <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Bot size={12} className="text-gray-900" />
                            </div>
                          )}
                          <div
                            className={`max-w-[78%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                              msg.role === 'user'
                                ? 'bg-green-600 text-white rounded-br-none'
                                : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100'
                            }`}
                          >
                            {msg.role === 'bot' ? (
                              <div className="space-y-0.5">{renderText(msg.text)}</div>
                            ) : (
                              <span className="text-xs">{msg.text}</span>
                            )}
                          </div>
                          {msg.role === 'user' && (
                            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <User size={12} className="text-gray-600" />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {loading && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                        <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
                          <Bot size={12} className="text-gray-900" />
                        </div>
                        <div className="bg-white rounded-xl rounded-bl-none px-3 py-2 shadow-sm border border-gray-100 flex gap-1 items-center">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-1.5 h-1.5 bg-green-500 rounded-full"
                              animate={{ y: [0, -5, 0] }}
                              transition={{ delay: i * 0.15, repeat: Infinity, duration: 0.6 }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                    <div ref={bottomRef} />
                  </div>

                  {/* Quick chips — only on first message */}
                  {messages.length <= 1 && (
                    <div className="px-3 py-2 bg-white border-t border-gray-100 flex flex-wrap gap-1.5">
                      {QUICK_CHIPS.map((chip) => (
                        <button
                          key={chip}
                          onClick={() => sendMessage(chip)}
                          disabled={loading}
                          className="text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full hover:bg-green-100 transition-colors disabled:opacity-50"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Input */}
                  <div className="flex gap-2 px-3 py-2 bg-white border-t border-gray-100 flex-shrink-0">
                    <button
                      onClick={reset}
                      title="New chat"
                      className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                    >
                      <RotateCcw size={13} />
                    </button>
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                      placeholder="Ask about Jharkhand..."
                      disabled={loading}
                      className="flex-1 text-xs outline-none text-gray-700 placeholder-gray-400 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus:border-green-400 transition-colors"
                    />
                    <button
                      onClick={() => sendMessage()}
                      disabled={!input.trim() || loading}
                      className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-all disabled:opacity-40 flex-shrink-0"
                    >
                      {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen((o) => !o)}
          className="relative w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-green-500/40 transition-shadow"
          title="Chat with Atithi AI"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X size={22} />
              </motion.span>
            ) : (
              <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <MessageCircle size={22} />
              </motion.span>
            )}
          </AnimatePresence>

          {/* Unread badge */}
          {!open && unread > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
              {unread}
            </span>
          )}

          {/* Sparkle effect on first load */}
          {!open && (
            <motion.span
              className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full"
              animate={{ scale: [1, 1.6, 1], opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: 1 }}
            />
          )}
        </motion.button>

        {/* Label tooltip */}
        {!open && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-16 right-0 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg pointer-events-none"
          >
            🙏 Ask Atithi AI
            <div className="absolute bottom-0 right-4 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900" />
          </motion.div>
        )}
      </div>
    </>
  );
}
