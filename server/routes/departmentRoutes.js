const express = require('express');
const departmentController = require('../controllers/departmentController');
const { checkPermissions, authenticateJWT } = require('../middlewares/auth');
const router = express.Router();

router.use(authenticateJWT);

router.get('/', checkPermissions('read', 'all', 'Departments'), departmentController.getAllDepartments);
router.get('/:id', checkPermissions('read', 'all', 'Departments'), departmentController.getDepartmentById);
router.post('/', checkPermissions('write', 'all', 'Departments'), departmentController.createDepartment);
router.put('/:id', checkPermissions('write', 'all', 'Departments'), departmentController.updateDepartment);
router.delete('/:id', checkPermissions('write', 'all', 'Departments'), departmentController.deleteDepartment);

module.exports = router;
