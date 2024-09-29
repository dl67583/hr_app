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
router.get('/me', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'role']
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
module.exports = router;
