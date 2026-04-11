const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, verifyProduct } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, authorize('Seller', 'Admin'), createProduct);
router.put('/:id/verify', protect, authorize('Admin'), verifyProduct);

module.exports = router;
