const express = require("express");
const router = express.Router();
const timeAttendanceController = require("../controllers/timeAttendanceController");
const authenticate = require("../middlewares/authMiddleware");

router.get(
  "/",
  authenticate,
  timeAttendanceController.getAllTimeAttendanceRecords
);
router.get(
  "/:id",
  authenticate,
  timeAttendanceController.getTimeAttendanceRecordById
);
router.post(
  "/",
  authenticate,
  timeAttendanceController.createTimeAttendanceRecord
);
router.put(
  "/:id",
  authenticate,
  timeAttendanceController.updateTimeAttendanceRecord
);
router.delete(
  "/:id",
  authenticate,
  timeAttendanceController.deleteTimeAttendanceRecord
);
router.post("/checkin", authenticate, timeAttendanceController.checkIn);
router.post("/checkout", authenticate, timeAttendanceController.checkOut);
router.get(
  "/status/:userId",
  authenticate,
  timeAttendanceController.getAttendanceStatus
);
// router.get("/atWork", authenticate, timeAttendanceController.getDepartmentMembersAtWork);

module.exports = router;
