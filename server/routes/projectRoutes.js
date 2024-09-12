const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticateJWT, checkPermissions } = require('../middlewares/auth');

// Public routes
router.get('/', projectController.getAll);

// Protected routes with role and permission checks
router.post('/', projectController.create);
router.put('/:id', projectController.update);
router.delete('/:id',  projectController.delete);

module.exports = router;
