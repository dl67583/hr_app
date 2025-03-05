
const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const authenticate = require("../middlewares/authMiddleware");

router.get("/birthdays/today", authenticate, dashboardController.getBirthdaysToday);

module.exports = router;

