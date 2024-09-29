const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

// Generate JWT access token (short-lived)
const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, 'access_token_secret', { expiresIn: '15m' });  // Short expiry
};

// Generate refresh token (longer-lived)
const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign({ id: user.id }, 'refresh_token_secret', { expiresIn: '7d' });  // Longer expiry
  user.refreshToken = refreshToken;
  user.save();  // Save refresh token to DB
  return refreshToken;
};

// Login controller
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) return res.status(400).json({ message: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

    const accessToken = generateAccessToken(user);  // Generate short-lived access token
    const refreshToken = generateRefreshToken(user);  // Generate long-lived refresh token

    res.json({ accessToken, refreshToken, user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    next(error);
  }
};


// Refresh token controller
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });

  try {
    // Verify refresh token and find user by refresh token in DB
    const user = await User.findOne({ where: { refreshToken } });
    if (!user) return res.status(403).json({ message: 'Invalid refresh token' });

    jwt.verify(refreshToken, 'refresh_token_secret', (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Invalid refresh token' });

      // Generate new access token
      const newAccessToken = generateAccessToken(user);
      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
