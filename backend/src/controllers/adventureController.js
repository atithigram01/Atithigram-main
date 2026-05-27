const Adventure = require('../models/Adventure');

// @desc    Get all adventures
// @route   GET /api/adventures
exports.getAdventures = async (req, res) => {
  try {
    const { activityType } = req.query;
    const filter = activityType ? { activityType } : {};
    const adventures = await Adventure.find(filter);
    res.json(adventures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single adventure
// @route   GET /api/adventures/:id
exports.getAdventure = async (req, res) => {
  try {
    const adventure = await Adventure.findById(req.params.id);
    if (!adventure) return res.status(404).json({ message: 'Adventure not found' });
    res.json(adventure);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create adventure
// @route   POST /api/adventures
exports.createAdventure = async (req, res) => {
  try {
    const adventure = await Adventure.create(req.body);
    res.status(201).json(adventure);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update adventure
// @route   PUT /api/adventures/:id
exports.updateAdventure = async (req, res) => {
  try {
    const adventure = await Adventure.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(adventure);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete adventure
// @route   DELETE /api/adventures/:id
exports.deleteAdventure = async (req, res) => {
  try {
    await Adventure.findByIdAndDelete(req.params.id);
    res.json({ message: 'Adventure removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
