const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { authenticateJWT, checkPermissions } = require('../middlewares/auth');

// Public routes
router.get('/', departmentController.getAllDepartments);

// Protected routes with role and permission checks
router.post('/',  departmentController.createDepartment);
router.put('/:id',  departmentController.updateDepartment);
router.delete('/:id',  departmentController.deleteDepartment);

module.exports = router;
