// roleRoutes.js
const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { authenticateJWT, checkPermissions } = require('../middlewares/auth');

// Protected routes with role and permission checks
router.get('/', authenticateJWT, checkPermissions('read'), roleController.getAll);
router.post('/', authenticateJWT, checkPermissions('write'), roleController.create);
router.put('/:id', authenticateJWT, checkPermissions('update'), roleController.update);
router.delete('/:id', authenticateJWT, checkPermissions('delete'), roleController.delete);

module.exports = router;
