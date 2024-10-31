const express = require('express');
const timeAttendanceController = require('../controllers/timeAttendanceController'); // Ensure this is correct
const { authenticateJWT, checkPermissions } = require('../middlewares/auth'); // Import required middleware

const router = express.Router();

// Define routes for time attendance
router.get('/', timeAttendanceController.getAllTimeAttendances);
router.get('/:id', timeAttendanceController.getTimeAttendanceById);
router.post('/', timeAttendanceController.createTimeAttendance);
router.put('/:id', timeAttendanceController.updateTimeAttendance);
router.delete('/:id', timeAttendanceController.deleteTimeAttendance);

module.exports = router;
