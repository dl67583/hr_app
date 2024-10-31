const express = require('express');
const projectRoleAssignmentController = require('../controllers/projectRoleAssignmentController');
const { checkPermission, authenticateJWT } = require('../middlewares/auth');
const router = express.Router();

// router.use(authenticateJWT);

router.get('/', projectRoleAssignmentController.getAllProjectRoleAssignments);
router.post('/', projectRoleAssignmentController.createProjectRoleAssignment);
router.put('/:id', projectRoleAssignmentController.updateProjectRoleAssignment);
router.delete('/:id', projectRoleAssignmentController.deleteProjectRoleAssignment);

module.exports = router;
