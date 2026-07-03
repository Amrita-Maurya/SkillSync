const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken, sendTokenCookie } = require('../utils/jwt');

// ─── REGISTER ─────────────────────────────────────────────
// POST /api/auth/register
// Public route — no authentication required
const register = async (req, res) => {
  try {
    const { name, email, college, password } = req.body;

    // Step 1: Check if email already exists
    // We return 409 Conflict — not 400 Bad Request
    // because the request itself is valid, the resource already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Step 2: Hash the password before storing
    // Cost factor 12 means bcrypt runs 2^12 = 4096 iterations
    // Higher cost = harder to brute force, but slower to compute
    // 12 is the industry standard balance between security and performance
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Step 3: Create the user in the database
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      college,
      passwordHash,
    });

    // Step 4: Generate JWT and send as httpOnly cookie
    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    // Step 5: Return user data (never return passwordHash)
    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          college: user.college,
          onboardingComplete: user.onboardingComplete,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages[0],
      });
    }

    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
    });
  }
};

// ─── LOGIN ─────────────────────────────────────────────────
// POST /api/auth/login
// Public route — no authentication required
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1: Basic presence check
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    // Step 2: Find user and explicitly include passwordHash
    // passwordHash has select: false on the schema
    // so we must use .select('+passwordHash') to get it
    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select('+passwordHash');

    if (!user) {
      // Deliberately vague message — don't reveal whether
      // the email exists or not (security best practice)
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Step 3: Compare the provided password with the stored hash
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Step 4: Generate JWT and send as httpOnly cookie
    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    // Step 5: Return user data
    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          college: user.college,
          onboardingComplete: user.onboardingComplete,
          skillsKnown: user.skillsKnown,
          skillsToLearn: user.skillsToLearn,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
    });
  }
};

// ─── GET ME ────────────────────────────────────────────────
// GET /api/auth/me
// Protected route — requires valid JWT cookie
// Called by React on every app load to check if user is logged in
const getMe = async (req, res) => {
  try {
    // req.user is already attached by the protect middleware
    // We just need to populate the skill references
    const user = await User.findById(req.user._id)
      .populate('skillsKnown.skillId', 'name category slug')
      .populate('skillsToLearn.skillId', 'name category slug');

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error('GetMe error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
    });
  }
};

// ─── LOGOUT ────────────────────────────────────────────────
// POST /api/auth/logout
// Protected route — requires valid JWT cookie
const logout = async (req, res) => {
  try {
    // Clear the cookie by setting it to expire immediately
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
    });
  }
};

module.exports = { register, login, getMe, logout };