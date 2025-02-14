const express = require("express");
const router = express.Router();
const userRoleController = require("../controllers/userRoleController");
const authenticate = require("../middlewares/authMiddleware");

router.post("/assign", authenticate, userRoleController.createUserRole);
router.get("/", authenticate, userRoleController.getAllUserRoles);
router.delete("/:id", authenticate, userRoleController.deleteUserRole);

module.exports = router;
