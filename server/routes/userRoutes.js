const express = require('express');
const userController = require('../controllers/userController'); // Ensure this path is correct
const { authenticateJWT, checkPermissions } = require('../middlewares/auth'); // Import middleware if needed

const router = express.Router();

// Example routes for users
router.get('/', authenticateJWT, checkPermissions('read', 'all', 'Users'), userController.getAllUsers);
router.get('/:id', authenticateJWT, checkPermissions('read', 'all', 'Users'), userController.getUserById);
router.post('/', authenticateJWT, checkPermissions('write', 'all', 'Users'), userController.createUser);
router.put('/:id', authenticateJWT, checkPermissions('write', 'all', 'Users'), userController.updateUser);
router.delete('/:id', authenticateJWT, checkPermissions('write', 'all', 'Users'), userController.deleteUser);

module.exports = router;
