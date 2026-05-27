const User = require('../models/User');
const Homestay = require('../models/Homestay');
const Product = require('../models/Product');
const Booking = require('../models/Booking');

// @desc   Get platform stats for admin dashboard
// @route  GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const [users, homestays, products, bookings] = await Promise.all([
      User.countDocuments(),
      Homestay.countDocuments(),
      Product.countDocuments(),
      Booking.countDocuments(),
    ]);
    res.json({ users, homestays, products, bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all users (admin only)
// @route  GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Verify a homestay
// @route  PATCH /api/admin/homestays/:id/verify
exports.verifyHomestay = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' | 'rejected'
    const homestay = await Homestay.findByIdAndUpdate(
      req.params.id,
      { isVerified: status === 'approved' },
      { new: true }
    );
    if (!homestay) return res.status(404).json({ message: 'Homestay not found' });
    res.json({ message: `Homestay ${status}`, homestay });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
