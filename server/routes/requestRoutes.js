const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");
const authenticate = require("../middlewares/authMiddleware");

router.get("/", authenticate, requestController.getAllRequests);
router.get("/:id", authenticate, requestController.getRequestById);
router.post("/", authenticate, requestController.createRequest);
router.put("/:id", authenticate, requestController.updateRequest);
router.delete("/:id", authenticate, requestController.deleteRequest);

module.exports = router;
