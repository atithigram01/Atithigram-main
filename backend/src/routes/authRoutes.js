const express = require('express');
const router = express.Router();
const { register, login, updateEcoPoints } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.patch('/eco-points', protect, updateEcoPoints);

module.exports = router;
