const express = require('express');
const paymentController = require('../controllers/paymentController');
const { checkPermissions, authenticateJWT } = require('../middlewares/auth');
const router = express.Router();

// router.use(authenticateJWT);

router.get('/', paymentController.getAllPayments);
router.get('/:id', paymentController.getPaymentById);
router.post('/', paymentController.createPayment);
router.put('/:id', paymentController.updatePayment);
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
