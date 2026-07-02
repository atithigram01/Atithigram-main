const mongoose = require('mongoose');

const adventureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  activityType: { type: String, required: true }, // e.g., Water Park, Rock Climbing, Trekking, Water Sports
  location: { type: String, required: true },
  mapsLink: { type: String },
  description: { type: String },
  bestSeason: { type: String },
  entryFee: { type: String },
  timing: { type: String },
  difficulty: { type: String }, // e.g., Easy, Moderate, Hard
  safetyAvailable: { type: String }, // e.g., Yes, No
  images: [{ type: String }],
  contactInfo: { type: String },
  onlineBooking: { type: Boolean, default: false },
  additionalNotes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Adventure', adventureSchema);
