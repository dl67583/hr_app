const express = require("express");
const router = express.Router();
const entityRoleAssignmentController = require("../controllers/entityRoleAssignmentController");
const authenticate = require("../middlewares/authMiddleware");

router.get("/", authenticate, entityRoleAssignmentController.getAllAssignments);
router.get("/:id", authenticate, entityRoleAssignmentController.getAssignmentById);
router.post("/", authenticate, entityRoleAssignmentController.createAssignment);
router.put("/:id", authenticate, entityRoleAssignmentController.updateAssignment);
router.delete("/:id", authenticate, entityRoleAssignmentController.deleteAssignment);

module.exports = router;
