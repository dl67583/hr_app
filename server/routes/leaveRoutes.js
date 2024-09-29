const express = require('express');
const maternityLeaveController = require('../controllers/maternityLeaveController');
const medicalLeaveController = require('../controllers/medicalLeaveController');
const paidLeaveController = require('../controllers/paidLeaveController');
const paternityLeaveController = require('../controllers/paternityLeaveController');
const unpaidLeaveController = require('../controllers/unpaidLeaveController');
const { checkPermissions, authenticateJWT } = require('../middlewares/auth');
const router = express.Router();

router.use(authenticateJWT);

// Maternity Leave
router.get('/maternity', checkPermissions('read', 'all', 'MaternityLeave'), maternityLeaveController.getAllMaternityLeaves);
router.post('/maternity', checkPermissions('write', 'all', 'MaternityLeave'), maternityLeaveController.createMaternityLeave);

// Medical Leave
router.get('/medical', checkPermissions('read', 'all', 'MedicalLeave'), medicalLeaveController.getAllMedicalLeaves);
router.post('/medical', checkPermissions('write', 'all', 'MedicalLeave'), medicalLeaveController.createMedicalLeave);

// Paid Leave
router.get('/paid', checkPermissions('read', 'all', 'PaidLeave'), paidLeaveController.getAllPaidLeaves);
router.post('/paid', checkPermissions('write', 'all', 'PaidLeave'), paidLeaveController.createPaidLeave);

// Paternity Leave
router.get('/paternity', checkPermissions('read', 'all', 'PaternityLeave'), paternityLeaveController.getAllPaternityLeaves);
router.post('/paternity', checkPermissions('write', 'all', 'PaternityLeave'), paternityLeaveController.createPaternityLeave);

// Unpaid Leavex
router.get('/unpaid', checkPermissions('read', 'all', 'UnpaidLeave'), unpaidLeaveController.getAllUnpaidLeaves);
router.post('/unpaid', checkPermissions('write', 'all', 'UnpaidLeave'), unpaidLeaveController.createUnpaidLeave);

module.exports = router;
