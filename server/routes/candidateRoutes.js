const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");
const authenticate = require("../middlewares/authMiddleware");

router.get("/", authenticate, candidateController.getAllCandidates);
router.get("/:id", authenticate, candidateController.getCandidateById);
router.post("/", authenticate, candidateController.createCandidate);
router.put("/:id", authenticate, candidateController.updateCandidate);
router.delete("/:id", authenticate, candidateController.deleteCandidate);

module.exports = router;
