const express = require('express');
const { checkPermission } = require('../middlewares/permission');
const departmentController = require('../controllers/departmentController');
const router = express.Router();

// Get all departments (accessible by admin or HR)
router.get('/', checkPermission('read', 'team', 'Department'), departmentController.getAll);

// Get a specific department (accessible by admin or HR)
router.get('/:id', checkPermission('read', 'team', 'Department'), departmentController.getById);

// Create a new department (accessible by admin)
router.post('/', checkPermission('write', 'team', 'Department'), departmentController.create);

// Update a department (accessible by admin)
router.put('/:id', checkPermission('write', 'team', 'Department'), departmentController.update);

// Delete a department (accessible by admin)
router.delete('/:id', checkPermission('write', 'team', 'Department'), departmentController.deleteDepartment);

module.exports = router;
