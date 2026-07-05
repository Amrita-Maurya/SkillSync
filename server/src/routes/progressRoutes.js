const express = require('express');
const router = express.Router();
const { logSession, getProgressLogs } = require('../controllers/progressController');
const { protect, checkOnboarding } = require('../middleware/auth');

// Both routes require login AND completed onboarding
// POST /api/progress
router.post('/', protect, checkOnboarding, logSession);

// GET /api/progress
router.get('/', protect, checkOnboarding, getProgressLogs);

module.exports = router;