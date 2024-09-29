const express = require('express');
const paymentController = require('../controllers/paymentController');
const { checkPermissions, authenticateJWT } = require('../middlewares/auth');
const router = express.Router();

router.use(authenticateJWT);

router.get('/', checkPermissions('read', 'all', 'Payments'), paymentController.getAllPayments);
router.get('/:id', checkPermissions('read', 'all', 'Payments'), paymentController.getPaymentById);
router.post('/', checkPermissions('write', 'all', 'Payments'), paymentController.createPayment);
router.put('/:id', checkPermissions('write', 'all', 'Payments'), paymentController.updatePayment);
router.delete('/:id', checkPermissions('write', 'all', 'Payments'), paymentController.deletePayment);

module.exports = router;
