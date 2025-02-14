const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");
const authenticate = require("../middlewares/authMiddleware");

router.get("/", authenticate, roleController.getAllRoles);
router.get("/:id", authenticate, roleController.getRoleById);
router.post("/", authenticate, roleController.createRole);
router.put("/:id", authenticate, roleController.updateRole);
router.delete("/:id", authenticate, roleController.deleteRole);

module.exports = router;
