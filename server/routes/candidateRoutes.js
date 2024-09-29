const express = require('express');
const candidateController = require('../controllers/candidateController');
const { checkPermissions, authenticateJWT } = require('../middlewares/auth');
const router = express.Router();

router.use(authenticateJWT); // Ensure all routes are protected

router.get('/', checkPermissions('read', 'all', 'Candidates'), candidateController.getAllCandidates);
router.get('/:id', checkPermissions('read', 'all', 'Candidates'), candidateController.getCandidateById);
router.post('/', checkPermissions('write', 'all', 'Candidates'), candidateController.createCandidate);
router.put('/:id', checkPermissions('write', 'all', 'Candidates'), candidateController.updateCandidate);
router.delete('/:id', checkPermissions('write', 'all', 'Candidates'), candidateController.deleteCandidate);

module.exports = router;
