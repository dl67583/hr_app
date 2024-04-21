    // routes/candidateRoutes.js

const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidatesController');

// Routes for candidates
router.get('/', candidateController.getAllCandidates);
router.get('/:id', candidateController.getCandidateById);
router.post('/', candidateController.createCandidate);
router.put('/:id', candidateController.updateCandidateById);
router.delete('/:id', candidateController.deleteCandidateById);

module.exports = router;
