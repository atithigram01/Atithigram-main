const express = require('express');
const router = express.Router();
const { getStats, getUsers, verifyHomestay } = require('../controllers/adminController');

// All routes require auth + Admin role — middleware can be added here later
router.get('/stats', getStats);
router.get('/users', getUsers);
router.patch('/homestays/:id/verify', verifyHomestay);

module.exports = router;
