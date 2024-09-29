const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

// Generate JWT token
const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, 'access_token_secret', { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign({ id: user.id }, 'refresh_token_secret');
  user.refreshToken = refreshToken;
  user.save();
  return refreshToken;
};

// Authenticate user (login)
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(400).json({ error: 'User not found' });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.json({ accessToken, refreshToken });
};

// Refresh the token
exports.refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ error: 'Access Denied' });

  const user = await User.findOne({ where: { refreshToken: token } });
  if (!user) return res.status(403).json({ error: 'Invalid refresh token' });

  jwt.verify(token, 'refresh_token_secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid refresh token' });

    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  });
};
