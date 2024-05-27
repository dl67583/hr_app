const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { authenticateJWT, generateToken, removeToken } = require('../middlewares/auth');
const secret = `What the fuck did you just fucking say about me, you little bitch? I'll have you know I graduated top of my class in the Navy Seals, and I've been involved in numerous secret raids on Al-Quaeda, and I have over 300 confirmed kills. I am trained in gorilla warfare and I'm the top sniper in the entire US armed forces. You are nothing to me but just another target. I will wipe you the fuck out with precision the likes of which has never been seen before on this Earth, mark my fucking words. You think you can get away with saying that shit to me over the Internet? Think again, fucker. As we speak I am contacting my secret network of spies across the USA and your IP is being traced right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing you call your life. You're fucking dead, kid. I can be anywhere, anytime, and I can kill you in over seven hundred ways, and that's just with my bare hands. Not only am I extensively trained in unarmed combat, but I have access to the entire arsenal of the United States Marine Corps and I will use it to its full extent to wipe your miserable ass off the face of the continent, you little shit. If only you could have known what unholy retribution your little "clever" comment was about to bring down upon you, maybe you would have held your fucking tongue. But you couldn't, you didn't, and now you're paying the price, you goddamn idiot. I will shit fury all over you and you will drown in it. You're fucking dead, kiddo.`;

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
