const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateJWT, checkPermissions } = require('../middlewares/auth');

// Public routes (if any)
// router.post('/users/register', userController.createUser);

// Protected routes with role and permission checks
router.get('', userController.getAllUsers);
router.post('', authenticateJWT, checkPermissions(['write']), userController.createUser);
router.put('/:id', authenticateJWT, checkPermissions(['write']), userController.updateUser);
router.delete('/:id', authenticateJWT, checkPermissions(['write']), userController.deleteUser);

module.exports = router;
