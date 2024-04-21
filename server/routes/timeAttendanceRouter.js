const express = require('express');
const router = express.Router();
const timeAttendanceController = require('../controllers/timeAttendanceController');

// Routes for time attendance
router.post('/', timeAttendanceController.createTimeAttendance);
router.get('/', timeAttendanceController.getAllTimeAttendance);
router.get('/:id', timeAttendanceController.getTimeAttendanceById);
router.put('/:id', timeAttendanceController.updateTimeAttendanceById);
router.delete('/:id', timeAttendanceController.deleteTimeAttendanceById);

module.exports = router;
