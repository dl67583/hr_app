const express = require('express');
const projectRoleAssignmentController = require('../controllers/projectRoleAssignmentController');
const { checkPermission, authenticateJWT } = require('../middlewares/auth');
const router = express.Router();

router.use(authenticateJWT);

router.get('/', checkPermission('read', 'all', 'ProjectRoleAssignments'), projectRoleAssignmentController.getAllProjectRoleAssignments);
router.post('/', checkPermission('write', 'all', 'ProjectRoleAssignments'), projectRoleAssignmentController.createProjectRoleAssignment);
router.put('/:id', checkPermission('write', 'all', 'ProjectRoleAssignments'), projectRoleAssignmentController.updateProjectRoleAssignment);
router.delete('/:id', checkPermission('write', 'all', 'ProjectRoleAssignments'), projectRoleAssignmentController.deleteProjectRoleAssignment);

module.exports = router;
