const Homestay = require('../models/Homestay');

// @desc    Get all homestays
// @route   GET /api/homestays
exports.getHomestays = async (req, res) => {
  try {
    const homestays = await Homestay.find({ isVerified: true }).populate('hostId', 'name email');
    res.json(homestays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single homestay
// @route   GET /api/homestays/:id
exports.getHomestay = async (req, res) => {
  try {
    const homestay = await Homestay.findById(req.params.id).populate('hostId', 'name email');
    if (!homestay) return res.status(404).json({ message: 'Homestay not found' });
    res.json(homestay);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create homestay (Host only)
// @route   POST /api/homestays
exports.createHomestay = async (req, res) => {
  try {
    const homestay = await Homestay.create({ ...req.body, hostId: req.user._id });
    res.status(201).json(homestay);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify homestay (Admin only)
// @route   PUT /api/homestays/:id/verify
exports.verifyHomestay = async (req, res) => {
  try {
    const homestay = await Homestay.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );
    res.json(homestay);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
