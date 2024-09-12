const express = require('express');
const requestsController = require('../controllers/requestController');
const router = express.Router();

router.post('/', requestsController.create);
router.get('/', requestsController.getAll);
router.get('/:id', requestsController.getById);
router.put('/:id', requestsController.update);
router.delete('/:id', requestsController.delete);

module.exports = router;
