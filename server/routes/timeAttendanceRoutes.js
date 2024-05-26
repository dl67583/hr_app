const express = require('express');
const timeAttendanceController = require('../controllers/timeAttendanceController');
const router = express.Router();

router.post('/', timeAttendanceController.createTimeAttendance);
router.get('/', timeAttendanceController.getTimeAttendances);
router.get('/:id', timeAttendanceController.getTimeAttendanceById);
router.put('/:id', timeAttendanceController.updateTimeAttendance);
router.delete('/:id', timeAttendanceController.deleteTimeAttendance);

module.exports = router;
