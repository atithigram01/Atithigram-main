const express = require('express');
const router = express.Router();
const { getPlaces, getPlace, createPlace, updatePlace, deletePlace } = require('../controllers/placeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getPlaces);
router.get('/:id', getPlace);
router.post('/', protect, authorize('Admin'), createPlace);
router.put('/:id', protect, authorize('Admin'), updatePlace);
router.delete('/:id', protect, authorize('Admin'), deletePlace);

module.exports = router;
