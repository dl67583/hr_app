const express = require('express');
const authController = require('../controllers/authController');
const { refreshAccessToken } = require('../middlewares/auth');
const router = express.Router();

// Login route
router.post('/login', authController.login);

// Token refresh route
router.post('/refresh', authController.refreshToken);

module.exports = router;
    