const express = require('express');
const router = express.Router();
const { register, login, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// ─── PUBLIC ROUTES ─────────────────────────────────────────
// No authentication required

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// ─── PROTECTED ROUTES ──────────────────────────────────────
// protect middleware runs first, then the controller
// If protect fails (no token, expired token), controller never runs

// GET /api/auth/me
// Called by React on every app load to hydrate auth state
router.get('/me', protect, getMe);

// POST /api/auth/logout
router.post('/logout', protect, logout);

module.exports = router;