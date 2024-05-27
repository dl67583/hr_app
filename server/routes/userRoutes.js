const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateJWT, checkPermissions } = require('../middlewares/auth');

// Public routes (if any)
// router.post('/users/register', userController.createUser);

// Protected routes with role and permission checks
router.get('', userController.getAllUsers);
router.post('', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
