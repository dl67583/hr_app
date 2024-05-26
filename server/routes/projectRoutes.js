const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticateJWT, checkPermissions } = require('../middlewares/auth');

// Public routes
router.get('/', projectController.getAllProjects);

// Protected routes with role and permission checks
router.post('/', authenticateJWT, checkPermissions(['write']), projectController.createProject);
router.put('/:id', authenticateJWT, checkPermissions(['write']), projectController.updateProject);
router.delete('/:id', authenticateJWT, checkPermissions(['write']), projectController.deleteProject);

module.exports = router;
