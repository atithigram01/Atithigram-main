const Place = require('../models/Place');
const Product = require('../models/Product');

const MOCK_RESPONSES = {
  default: "Johar! 🙏 I'm your ATITHIGRAM travel assistant. Ask me about places, itineraries, tribal culture, or homestays!",
  greet: "Johar! 🙏 Welcome to Jharkhand's tourism guide. Where would you like to explore today?",
  waterfall: "Jharkhand has stunning waterfalls! 🌊\n\n• **Hundru Falls** (98m) near Ranchi\n• **Jonha Falls** — sacred waterfall near Ranchi\n• **Dasam Falls** — scenic falls in Seraikela-Kharsawan\n• **Hirni Falls** — lush forested escape\n\nBest visited October–February for clear skies and full flow!",
  temple: "Jharkhand has ancient temples! 🛕\n\n• **Baidyanath Dham**, Deoghar (Jyotirlinga)\n• **Jagannath Temple**, Ranchi\n• **Rajrappa Temple** (Chhinnamastika Devi shrine)\n• **Pahari Mandir** overlooking Ranchi city\n• **Maa Dewri Mandir (Deori Temple)** — ancient temple in Tamar\n\nBest during Shivratri or Diwali for a spiritual experience!",
  tribal: "Jharkhand is home to rich tribal cultures! 🌿\n\n• **Santal tribe** — largest tribal group, famous for Sohrai art\n• **Oraon tribe** — celebrate Sarhul (spring festival)\n• **Munda tribe** — known for vibrant Ho music\n• **Birsa Munda Museum**, Ranchi is a must-visit\n\nTip: Plan your trip around *Sarhul* (March–April) for cultural immersion!",
  itinerary: "Here's a perfect **5-Day Jharkhand Itinerary** ✈️\n\n**Day 1 — Ranchi:** Ranchi Lake, Pahari Mandir, Jagannath Temple\n**Day 2 — Waterfalls:** Hundru Falls, Jonha Falls, Dasam Falls\n**Day 3 — Betla:** National Park Safari, Forest Homestay\n**Day 4 — Deoghar:** Baidyanath Dham, local bazaar\n**Day 5 — Tribal Culture:** Santal Heritage Village, Dokra Art Workshop\n\n🌱 Eco-points earned: **50 points** on this trip!",
  homestay: "ATITHIGRAM has verified homestays across Jharkhand:\n\n• **Nature Nest** — Netarhat, ₹1,200/night ⭐ 4.9\n• **Santal Heritage House** — Dumka, ₹900/night ⭐ 4.7\n• **Forest Retreat** — Betla, ₹1,500/night ⭐ 5.0\n• **Eco River View** — Koderma, ₹800/night ⭐ 4.6\n\nAll admin-verified ✅ — booking directly supports host families! 🏡",
  handicraft: "Jharkhand's handicrafts are world-famous! 🎨\n\n• **Dokra Art** — ancient lost-wax metal casting\n• **Paitkar Paintings** — tribal scroll art\n• **Kantha Embroidery** — intricate textile work\n• **Sabai Grass Weaving** — eco-friendly baskets\n• **Tussar Silk** — premium natural silk\n\nVisit our Handicrafts Marketplace to shop directly from artisans!",
  ecopoints: "🌱 **Eco-Points System:**\n\nEarn points for sustainable choices:\n• Book a verified homestay → **+20 pts**\n• Buy from local artisans → **+10 pts per item**\n• Refer a friend → **+15 pts**\n• Write a travel review → **+5 pts**\n\nRedeem for:\n• 10% off homestays (50 pts)\n• Free guided tour (100 pts)\n• Artisan gift (80 pts)\n• Priority booking (30 pts)\n\nHelping protect Jharkhand's nature! 💚",
  budget: "Here's a **Budget Guide for Jharkhand** 💰\n\n**Budget Travel (₹1,000–2,000/day):**\n• Homestays from ₹800/night\n• Local dhabas for meals (₹100–200)\n\n**Mid-Range (₹2,000–5,000/day):**\n• Forest retreats, guided safaris\n• Traditional Jharkhand thali\n\n**Best Season:** October to March for ideal weather!\n\n🎒 Tip: Book homestays via ATITHIGRAM and earn Eco-Points on every rupee spent!",
};

function getMockResponse(message) {
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

exports.chat = async (req, res) => {
  try {
    const { message, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.trim() === '') {
      console.log("No GEMINI_API_KEY found. Falling back to local mock responses.");
      return res.json({ response: getMockResponse(message) });
    }

    // Dynamic Database Query for Real-Time Context
    let placesContext = "";
    let productsContext = "";
    try {
      const dbPlaces = await Place.find({});
      const dbProducts = await Product.find({ isVerified: true });
      
      placesContext = dbPlaces.map(p => `• **${p.name}** (${p.category}): ${p.description} [Location: ${p.coordinates.lat}°N, ${p.coordinates.lng}°E]`).join('\n');
      productsContext = dbProducts.map(pr => `• **${pr.name}**: ${pr.description} (Price: ₹${pr.price})`).join('\n');
    } catch (dbErr) {
      console.error("Database query failed inside plannerController:", dbErr.message);
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const contents = [];

    // System instruction (custom prompt for Atithigram Jharkhand travel planning)
    const systemPromptText = `You are ATITHIGRAM, a highly knowledgeable, friendly, and professional AI travel planning assistant for Jharkhand Tourism. Your mission is to provide customized travel itineraries, suggestions, and tips focused on eco-tourism, tribal culture, heritage sites, and local authentic handicrafts. Encourage sustainable travel and mention earning Eco-Points for positive impacts (e.g. buying crafts, visiting eco-zones). Keep responses rich in detail, beautifully formatted, warm, and professional. Always welcome the user with the traditional Jharkhand greeting: 'Johar! 🙏'. Respond in clear Markdown formatting with bullet points and bold headers where appropriate.

Here is the LIVE data currently stored in our ATITHIGRAM database. When creating itineraries or suggesting places to visit, you MUST recommend these exact spots and handicrafts first:

### TOURIST PLACES IN JHARKHAND:
${placesContext || 'No database spots loaded.'}

### HANDICRAFTS IN OUR MARKETPLACE:
${productsContext || 'No database handicrafts loaded.'}
`;

    const systemInstruction = {
      role: "user",
      parts: [{ text: systemPromptText }]
    };
    contents.push(systemInstruction);

    // Seed the initial confirmation from the model to match model role format
    contents.push({
      role: "model",
      parts: [{ text: "Johar! 🙏 Understood. I am ATITHIGRAM, your sustainable travel assistant for Jharkhand. I will use the live database places and products to plan the perfect trip. How can I help you explore today?" }]
    });

    if (history && history.length > 0) {
      history.forEach(msg => {
        const role = msg.role === 'bot' ? 'model' : 'user';
        contents.push({
          role: role,
          parts: [{ text: msg.text }]
        });
      });
    }

    // Push current message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API server returned error:", errText);
      return res.json({ response: getMockResponse(message) });
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const responseText = candidate?.content?.parts?.[0]?.text || getMockResponse(message);

    res.json({ response: responseText });

  } catch (error) {
    console.error("Gemini API Fetch Error:", error.message);
    res.json({ response: getMockResponse(req.body.message) });
  }
};
