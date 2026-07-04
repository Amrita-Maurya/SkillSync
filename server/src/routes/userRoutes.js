const express = require('express');
const router = express.Router();
const { updateProfile, getMe } = require('../controllers/userController');
const { protect, checkOnboarding } = require('../middleware/auth');

// GET /api/users/me
router.get('/me', protect, getMe);

// PUT /api/users/profile
router.put('/profile', protect, updateProfile);

module.exports = router;