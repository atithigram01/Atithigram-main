const User = require('../models/User');
const Role = require('../models/Role');

// @desc    Register new user or sync Supabase signup
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, supabaseId, role } = req.body;
    
    let user = await User.findOne({ $or: [{ supabaseId }, { email }] });
    
    let roleDoc = await Role.findOne({ name: role || 'User' });
    if (!roleDoc) {
      roleDoc = await Role.create({ name: role || 'User', permissions: [] });
    }

    if (user) {
      // Sync details if user exists (e.g. pre-seeded account registering with Supabase)
      user.supabaseId = supabaseId;
      if (name) user.name = name;
      await user.save();
    } else {
      // Create new user profile in MongoDB linked to Supabase
      user = await User.create({
        name,
        email,
        supabaseId,
        role: roleDoc._id
      });
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: roleDoc.name,
      ecoPoints: user.ecoPoints || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate/Sync a user session
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, supabaseId } = req.body;
    
    let user = await User.findOne({ $or: [{ supabaseId }, { email }] }).populate('role');

    if (!user) {
      // Create a profile on the fly if authenticated by Supabase but not yet in MongoDB
      let roleDoc = await Role.findOne({ name: 'User' });
      if (!roleDoc) {
        roleDoc = await Role.create({ name: 'User', permissions: [] });
      }
      user = await User.create({
        name: email.split('@')[0], // Default name from email prefix
        email,
        supabaseId,
        role: roleDoc._id
      });
      user = await user.populate('role');
    } else if (!user.supabaseId) {
      // Sync supabaseId if they were pre-seeded in the database
      user.supabaseId = supabaseId;
      await user.save();
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role?.name || user.role,
      ecoPoints: user.ecoPoints || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user eco points
// @route   PATCH /api/auth/eco-points
exports.updateEcoPoints = async (req, res) => {
  try {
    const { points } = req.body;
    const user = await User.findById(req.user._id).populate('role');

    if (user) {
      user.ecoPoints = (user.ecoPoints || 0) + Number(points);
      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role?.name || updatedUser.role,
        ecoPoints: updatedUser.ecoPoints
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
