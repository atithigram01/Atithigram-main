const express = require('express');
const router = express.Router();
const { getHomestays, getHomestay, createHomestay, verifyHomestay } = require('../controllers/homestayController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getHomestays);
router.get('/:id', getHomestay);
router.post('/', protect, authorize('Host', 'Admin'), createHomestay);
router.put('/:id/verify', protect, authorize('Admin'), verifyHomestay);

module.exports = router;
