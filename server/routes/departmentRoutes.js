// departmentRoutes.js
const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { authenticateJWT, checkPermissions } = require('../middlewares/auth');

// Public route to get all departments
router.get('/', departmentController.getAllDepartments);

// Protected routes with role and permission checks
router.post('/', authenticateJWT, checkPermissions('write'), departmentController.createDepartment);
router.put('/:id', authenticateJWT, checkPermissions('update'), departmentController.updateDepartment);
router.delete('/:id', authenticateJWT, checkPermissions('delete'), departmentController.deleteDepartment);

module.exports = router;
