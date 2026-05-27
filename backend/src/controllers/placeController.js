const Place = require('../models/Place');

// @desc    Get all places
// @route   GET /api/places
exports.getPlaces = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const places = await Place.find(filter);
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single place
// @route   GET /api/places/:id
exports.getPlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found' });
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create place (Admin only)
// @route   POST /api/places
exports.createPlace = async (req, res) => {
  try {
    const place = await Place.create(req.body);
    res.status(201).json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update place
// @route   PUT /api/places/:id
exports.updatePlace = async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete place
// @route   DELETE /api/places/:id
exports.deletePlace = async (req, res) => {
  try {
    await Place.findByIdAndDelete(req.params.id);
    res.json({ message: 'Place removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
