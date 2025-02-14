const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leaveController");
const authenticate = require("../middlewares/authMiddleware");

router.get("/", authenticate, leaveController.getAllLeaves);
router.get("/:id", authenticate, leaveController.getLeaveById);
router.post("/", authenticate, leaveController.createLeave);
router.put("/:id", authenticate, leaveController.updateLeave);
router.delete("/:id", authenticate, leaveController.deleteLeave);

module.exports = router;
