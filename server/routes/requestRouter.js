const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

// Routes for requests
router.post('/', requestController.createRequest);
router.get('/', requestController.getAllRequests);
router.get('/:id', requestController.getRequestById);
router.put('/:id', requestController.updateRequestById);
router.delete('/:id', requestController.deleteRequestById);

module.exports = router;
