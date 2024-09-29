const express = require('express');
const projectController = require('../controllers/projectController');
const { checkPermissions, authenticateJWT } = require('../middlewares/auth');
const router = express.Router();

router.use(authenticateJWT);

router.get('/', checkPermissions('read', 'all', 'Projects'), projectController.getAllProjects);
router.get('/:id', checkPermissions('read', 'all', 'Projects'), projectController.getProjectById);
router.post('/', checkPermissions('write', 'all', 'Projects'), projectController.createProject);
router.put('/:id', checkPermissions('write', 'all', 'Projects'), projectController.updateProject);
router.delete('/:id', checkPermissions('write', 'all', 'Projects'), projectController.deleteProject);

module.exports = router;
