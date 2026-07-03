const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─── PROTECT MIDDLEWARE ────────────────────────────────────
// Attach this to any route that requires authentication
// Usage: router.get('/profile', protect, getProfile)
const protect = async (req, res, next) => {
  try {
    // Step 1: Extract token from httpOnly cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated. Please log in.',
      });
    }

    // Step 2: Verify the token signature and expiry
    // jwt.verify throws if token is invalid or expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 3: Find the user from the ID stored in the token payload
    // We exclude passwordHash since we never need it after login
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.',
      });
    }

    // Step 4: Update lastActiveDate on every authenticated request
    // This is used for doubt notification routing (most recently active users)
    await User.findByIdAndUpdate(decoded.id, {
      lastActiveDate: new Date(),
    });

    // Step 5: Attach user to request object
    // Now req.user is available in every route handler after this middleware
    req.user = user;

    next();
  } catch (error) {
    // Handle specific JWT errors with clear messages
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please log in again.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication error.',
    });
  }
};

// ─── CHECK ONBOARDING ──────────────────────────────────────
// Secondary middleware used after protect
// Prevents users from accessing the app before completing onboarding
// Usage: router.get('/dashboard', protect, checkOnboarding, getDashboard)
const checkOnboarding = (req, res, next) => {
  if (!req.user.onboardingComplete) {
    return res.status(403).json({
      success: false,
      message: 'Please complete onboarding first.',
      redirectTo: '/onboarding',
    });
  }
  next();
};

module.exports = { protect, checkOnboarding };