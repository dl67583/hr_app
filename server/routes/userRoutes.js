const express = require('express');
const { checkPermission } = require('../middlewares/permission');
const userController = require('../controllers/userController');
const router = express.Router();

// Get all users in a department (department head or team access)
router.get('/department/:departmentId', checkPermission('read', 'department', 'User'), userController.getByDepartment);

// Get a specific user
router.get('/:id', checkPermission('read', 'individual', 'User'), userController.getById);

// Create a new user
router.post('/', checkPermission('write', 'team', 'User'), userController.create);

// Update a user
router.put('/:id', checkPermission('write', 'individual', 'User'), userController.update);

// Delete a user
router.delete('/:id', checkPermission('write', 'team', 'User'), userController.deleteUser);

module.exports = router;
