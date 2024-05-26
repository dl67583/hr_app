const express = require('express');
const departmentProjectController = require('../controllers/departmentProjectController');
const router = express.Router();

router.post('/', departmentProjectController.createDepartmentProject);
router.get('/', departmentProjectController.getDepartmentProjects);
router.get('/:id', departmentProjectController.getDepartmentProjectById);
router.put('/:id', departmentProjectController.updateDepartmentProject);
router.delete('/:id', departmentProjectController.deleteDepartmentProject);

module.exports = router;
