const express = require('express');
const userController = require('../controllers/userController'); // Ensure this path is correct
const { authenticateJWT, checkPermissions } = require('../middlewares/auth'); // Import middleware if needed

const router = express.Router();

// Example routes for users
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// Route for the authenticated user to get their own details
// router.get('/me', async (req, res) => {
//   try {
//     // Fetch the authenticated user based on the JWT token
//     const user = await User.findByPk(req.user.id, {
//       attributes: ['id', 'username', 'email', 'roleId'], // Ensure roleId is included if needed
//       include: {
//         model: Role,
//         as: 'Role',  // Ensure role is included in the user details
//         attributes: ['id', 'name'] // Include necessary role attributes
//       }
//     });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json(user);  // Return the user details including role
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

module.exports = router;
