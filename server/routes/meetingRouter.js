const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');

// Routes for meetings
router.post('/', meetingController.createMeeting);
router.get('/', meetingController.getAllMeetings);
router.get('/:id', meetingController.getMeetingById);
router.put('/:id', meetingController.updateMeetingById);
router.delete('/:id', meetingController.deleteMeetingById);

module.exports = router;
