const jwt = require('jsonwebtoken');

// ─── GENERATE TOKEN ────────────────────────────────────────
// Creates a signed JWT containing the user's ID
// Expires in 7 days (configured in .env)
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// ─── SEND TOKEN AS COOKIE ──────────────────────────────────
// Generates the token and attaches it to the response as an httpOnly cookie
// httpOnly = JavaScript cannot read this cookie (prevents XSS)
// secure = cookie only sent over HTTPS (enabled in production)
// sameSite = strict prevents CSRF attacks
const sendTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  };

  res.cookie('token', token, cookieOptions);
};

module.exports = { generateToken, sendTokenCookie };