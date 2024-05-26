const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { authenticateJWT, checkPermissions } = require('../middlewares/auth');

// Public routes (if any)
// router.post('/roles/register', roleController.createRole);

// Protected routes with role and permission checks
router.get('/', roleController.getAllRoles);
router.post('/', roleController.createRole);
router.put('/:id',  roleController.updateRole);
router.delete('/:id',  roleController.deleteRole);

module.exports = router;
