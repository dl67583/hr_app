const express = require('express');
const candidatesController = require('../controllers/candidateController');
const { checkPermissions } = require('../middlewares/auth');
const router = express.Router();

router.post('/', checkPermissions(['create_candidate']), candidatesController.createCandidate);
router.get('/', checkPermissions(['view_candidates']), candidatesController.getAllCandidates);
router.get('/:id', checkPermissions(['view_candidate']), candidatesController.getCandidateById);
router.put('/:id', checkPermissions(['edit_candidate']), candidatesController.updateCandidate);
router.delete('/:id', checkPermissions(['delete_candidate']), candidatesController.deleteCandidate);

module.exports = router;
