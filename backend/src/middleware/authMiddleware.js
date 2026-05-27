const supabase = require('../config/supabase');
const User = require('../models/User');
const Role = require('../models/Role');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // 1. Verify the Supabase access token (JWT)
      const { data: { user: supabaseUser }, error: supabaseError } = await supabase.auth.getUser(token);
      
      if (supabaseError || !supabaseUser) {
        return res.status(401).json({ message: 'Not authorized, Supabase token failed' });
      }

      // 2. Fetch or dynamically create the corresponding MongoDB User profile
      let dbUser = await User.findOne({ $or: [{ supabaseId: supabaseUser.id }, { email: supabaseUser.email }] }).populate('role');
      
      if (!dbUser) {
        let roleDoc = await Role.findOne({ name: 'User' });
        if (!roleDoc) {
          roleDoc = await Role.create({ name: 'User', permissions: [] });
        }
        dbUser = await User.create({
          name: supabaseUser.email.split('@')[0],
          email: supabaseUser.email,
          supabaseId: supabaseUser.id,
          role: roleDoc._id
        });
        dbUser = await dbUser.populate('role');
      } else if (!dbUser.supabaseId) {
        // Sync supabaseId if they were pre-seeded in the database
        dbUser.supabaseId = supabaseUser.id;
        await dbUser.save();
      }

      req.user = dbUser;
      next();
    } catch (error) {
      console.error('authMiddleware error:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const userRole = req.user.role?.name || req.user.role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: `Role ${userRole} is not authorized to access this route` });
    }
    next();
  };
};

module.exports = { protect, authorize };
