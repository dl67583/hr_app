const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { authenticateJWT, checkPermissions } = require('../middlewares/auth');

// Public routes
router.get('/', departmentController.getAllDepartments);

// Protected routes with role and permission checks
router.post('/', authenticateJWT, checkPermissions(['write']), departmentController.createDepartment);
router.put('//:id', authenticateJWT, checkPermissions(['write']), departmentController.updateDepartment);
router.delete('//:id', authenticateJWT, checkPermissions(['write']), departmentController.deleteDepartment);

module.exports = router;
