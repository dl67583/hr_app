const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/departmentController");
const authenticate = require("../middlewares/authMiddleware");

router.get("/", authenticate, departmentController.getAllDepartments);
router.get("/:id", authenticate, departmentController.getDepartmentById);
router.post("/", authenticate, departmentController.createDepartment);
router.put("/:id", authenticate, departmentController.updateDepartment);
router.delete("/:id", authenticate, departmentController.deleteDepartment);

module.exports = router;
