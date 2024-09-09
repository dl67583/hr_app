// roleRoutes.js
const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { authenticateJWT, checkPermissions } = require('../middlewares/auth');

// Protected routes with role and permission checks
router.get('/', authenticateJWT, checkPermissions('read'), roleController.getAllRoles);
router.post('/', authenticateJWT, checkPermissions('write'), roleController.createRole);
router.put('/:id', authenticateJWT, checkPermissions('update'), roleController.updateRole);
router.delete('/:id', authenticateJWT, checkPermissions('delete'), roleController.deleteRole);

module.exports = router;
