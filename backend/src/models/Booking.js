const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'itemModel' }, 
  itemModel: { type: String, required: true, enum: ['Homestay', 'Product'], default: 'Homestay' },
  checkIn: { type: Date },
  checkOut: { type: Date },
  guests: { type: Number },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
