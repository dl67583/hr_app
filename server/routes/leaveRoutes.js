const express = require('express');
const maternityLeaveController = require('../controllers/maternityLeaveController');
const medicalLeaveController = require('../controllers/medicalLeaveController');
const paidLeaveController = require('../controllers/paidLeaveController');
const paternityLeaveController = require('../controllers/paternityLeaveController');
const unpaidLeaveController = require('../controllers/unpaidLeaveController');
const { checkPermissions, authenticateJWT } = require('../middlewares/auth');
const router = express.Router();

// router.use(authenticateJWT);

// Maternity Leave
router.get('/maternity', maternityLeaveController.getAllMaternityLeaves);
router.post('/maternity', maternityLeaveController.createMaternityLeave);

// Medical Leave
router.get('/medical', medicalLeaveController.getAllMedicalLeaves);
router.post('/medical', medicalLeaveController.createMedicalLeave);

// Paid Leave
router.get('/paid', paidLeaveController.getAllPaidLeaves);
router.post('/paid', paidLeaveController.createPaidLeave);

// Paternity Leave
router.get('/paternity', paternityLeaveController.getAllPaternityLeaves);
router.post('/paternity', paternityLeaveController.createPaternityLeave);

// Unpaid Leavex
router.get('/unpaid', unpaidLeaveController.getAllUnpaidLeaves);
router.post('/unpaid', unpaidLeaveController.createUnpaidLeave);

module.exports = router;
