const express = require('express');
const roleController = require('../controllers/roleController');
const { checkPermissions, authenticateJWT } = require('../middlewares/auth');
const router = express.Router();

router.use(authenticateJWT);

router.get('/', checkPermissions('read', 'all', 'Roles'), roleController.getAllRoles);
router.post('/', checkPermissions('write', 'all', 'Roles'), roleController.createRole);
router.put('/:id', checkPermissions('write', 'all', 'Roles'), roleController.updateRole);
router.delete('/:id', checkPermissions('write', 'all', 'Roles'), roleController.deleteRole);

module.exports = router;
