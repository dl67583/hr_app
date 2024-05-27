const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { authenticateJWT, generateToken, removeToken } = require('../middlewares/auth');
const secret = process.env.JWT_SECRET;

// User login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log('Password does not match');
      return res.status(401).json({ error: 'Authentication failed' });
    }
console.log(passwordMatch)
    const token = await generateToken(user);

    res.status(200).json({ token });
  } catch (error) {
    console.error('Login failed', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// User logout
router.post('/logout', authenticateJWT, async (req, res) => {
  try {
    await removeToken(req.user.userId);
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error('Logout failed', error);
    res.status(500).json({ error: 'Logout failed', details: error.message });
  }
});

module.exports = router;
