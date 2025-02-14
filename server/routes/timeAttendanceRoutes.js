const express = require("express");
const router = express.Router();
const timeAttendanceController = require("../controllers/timeAttendanceController");
const authenticate = require("../middlewares/authMiddleware");

router.get("/", authenticate, timeAttendanceController.getAllTimeAttendanceRecords);
router.get("/:id", authenticate, timeAttendanceController.getTimeAttendanceRecordById);
router.post("/", authenticate, timeAttendanceController.createTimeAttendanceRecord);
router.put("/:id", authenticate, timeAttendanceController.updateTimeAttendanceRecord);
router.delete("/:id", authenticate, timeAttendanceController.deleteTimeAttendanceRecord);

module.exports = router;
