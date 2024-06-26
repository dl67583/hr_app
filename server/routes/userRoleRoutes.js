const express = require('express');
const userRoleController = require('../controllers/userRoleController');
const router = express.Router();

router.post('/', userRoleController.createUserRole);
router.get('/', userRoleController.getUserRoles);
router.get('/:id', userRoleController.getUserRoleById);
router.put('/:id', userRoleController.updateUserRole);
router.delete('/:id', userRoleController.deleteUserRole);

module.exports = router;
