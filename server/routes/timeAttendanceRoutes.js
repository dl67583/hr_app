const express = require('express');
const timeAttendanceController = require('../controllers/timeAttendanceController'); // Ensure this is correct
const { authenticateJWT, checkPermissions } = require('../middlewares/auth'); // Import required middleware

const router = express.Router();

// Define routes for time attendance
router.get('/', authenticateJWT, checkPermissions('read', 'all', 'TimeAttendance'), timeAttendanceController.getAllTimeAttendances);
router.get('/:id', authenticateJWT, checkPermissions('read', 'all', 'TimeAttendance'), timeAttendanceController.getTimeAttendanceById);
router.post('/', authenticateJWT, checkPermissions('write', 'all', 'TimeAttendance'), timeAttendanceController.createTimeAttendance);
router.put('/:id', authenticateJWT, checkPermissions('write', 'all', 'TimeAttendance'), timeAttendanceController.updateTimeAttendance);
router.delete('/:id', authenticateJWT, checkPermissions('write', 'all', 'TimeAttendance'), timeAttendanceController.deleteTimeAttendance);

module.exports = router;
