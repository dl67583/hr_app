const express = require('express');
const candidatesController = require('../controllers/candidateController');
const { checkPermissions } = require('../middlewares/auth');
const router = express.Router();

router.post('/',  candidatesController.createCandidate);
router.get('/', candidatesController.getAllCandidates);
router.get('/:id', candidatesController.getCandidateById);
router.put('/:id',  candidatesController.updateCandidate);
router.delete('/:id',  candidatesController.deleteCandidate);

module.exports = router;
