const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateJWT, checkPermissions } = require('../middlewares/auth');

// Public routes (if any)
// router.post('/users/register', userController.createUser);

// Protected routes with role and permission checks
router.get('/users', userController.getAll);
router.post('/users', userController.create);
router.put('/users/:id', userController.update);
router.delete('/users/:id', userController.delete);

module.exports = router;
