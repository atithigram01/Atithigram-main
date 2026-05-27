const mongoose = require('mongoose');

const homestaySchema = new mongoose.Schema({
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  pricePerNight: { type: Number, required: true },
  images: [{ type: String }],
  isVerified: { type: Boolean, default: false },
  commissionRate: { type: Number, default: 25 }, // 25% commission from homestay owners
}, { timestamps: true });

module.exports = mongoose.model('Homestay', homestaySchema);
