const express = require("express");
const router = express.Router();
const rolePermissionController = require("../controllers/rolePermissionController");
const authenticate = require("../middlewares/authMiddleware");

router.get("/", authenticate, rolePermissionController.getAllRolePermissions);
router.get("/:id", authenticate, rolePermissionController.getRolePermissionById);
router.post("/", authenticate, rolePermissionController.createRolePermission);
router.put("/:id", authenticate, rolePermissionController.updateRolePermission);
router.delete("/:id", authenticate, rolePermissionController.deleteRolePermission);

module.exports = router;
