const express = require('express');
const departmentController = require('../controllers/departmentController');
const { checkPermissions, authenticateJWT } = require('../middlewares/auth');
const router = express.Router();

// router.use(authenticateJWT);

router.get('/', departmentController.getAllDepartments);
router.get('/:id', departmentController.getDepartmentById);
router.post('/', departmentController.createDepartment);
router.put('/:id', departmentController.updateDepartment);
router.delete('/:id', departmentController.deleteDepartment);

module.exports = router;
