const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  price: { type: Number, required: true },
  images: [{ type: String }],
  isVerified: { type: Boolean, default: false },
  platformFeeRate: { type: Number, default: 20 }, // 20% platform fee from handicraft sellers
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
