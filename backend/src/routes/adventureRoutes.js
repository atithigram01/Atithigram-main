const express = require('express');
const router = express.Router();
const { getAdventures, getAdventure, createAdventure, updateAdventure, deleteAdventure } = require('../controllers/adventureController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAdventures);
router.get('/:id', getAdventure);
router.post('/', protect, authorize('Admin'), createAdventure);
router.put('/:id', protect, authorize('Admin'), updateAdventure);
router.delete('/:id', protect, authorize('Admin'), deleteAdventure);

module.exports = router;
