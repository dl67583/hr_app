const express = require('express');
const { generateToken, refreshAccessToken } = require('../middlewares/auth');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await userController.authenticateUser(username, password);
  if (user) {
    const token = await generateToken(user);
    const refreshToken = await generateRefreshToken(user);
    return res.status(200).json({ token, refreshToken });
  }
  res.status(401).json({ message: 'Invalid credentials' });
});

router.post('/refresh', refreshAccessToken);

module.exports = router;
