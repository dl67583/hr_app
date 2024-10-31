const express = require('express');
const roleController = require('../controllers/roleController');
const { checkPermissions, authenticateJWT } = require('../middlewares/auth');
const router = express.Router();

// router.use(authenticateJWT);

router.get('/', roleController.getAllRoles);
router.post('/', roleController.createRole);
router.put('/:id', roleController.updateRole);
router.delete('/:id', roleController.deleteRole);

module.exports = router;
