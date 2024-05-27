const express = require('express');
const requestsController = require('../controllers/requestController');
const router = express.Router();

router.post('/', requestsController.createRequest);
router.get('/', requestsController.getRequests);
router.get('/:id', requestsController.getRequestById);
router.put('/:id', requestsController.updateRequest);
router.delete('/:id', requestsController.deleteRequest);

module.exports = router;
