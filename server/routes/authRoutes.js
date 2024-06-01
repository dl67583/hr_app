const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { authenticateJWT, generateToken, removeToken } = require('../middlewares/auth');
const secret = `Thermodynamics is the study of the relationship between heat (or energy) and work. In other words, thermodynamics looks at how we can put energy into a system (whether it is a machine or a molecule) and make it do work. Alternatively, we might be able to do some work on a system and make it produce energy (like spinning the turbines in a power station to produce electricity).

In chemistry, we sometimes speak more broadly about "energetics" of reactions (rather than thermodynamics), because energy given off during a reaction may simply be lost to the surroundings without doing useful work. Nevertheless, the ideas are the same: energy can be added to a set of molecules in order to produce a reaction, or a reaction can occur between a set of molecules in order to release energy.

A classic example of reaction energetics is the hydrolysis of ATP to ADP in biology. This reaction is used in the cell as a source of energy; the energy released from the reaction is frequently coupled to other processes that could not occur without the added energy.`;

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

router.post('/verify-token', async (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
    console.log("no token")
  }

  try {
    const decoded = jwt.verify(token, secret);
    const user = await User.findByPk(decoded.userId);

    if (!user || user.token !== token) {
      return res.status(401).json({ message: 'Invalid token.' });
      console.log("wrong token")
    }
    console.log("auth")
    res.status(200).json({ valid: true });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
});


module.exports = router;
