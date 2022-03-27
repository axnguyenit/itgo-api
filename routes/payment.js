const express = require('express');
const router = express.Router();
const authentication = require('../app/middleware/authentication');
const paymentController = require('../app/controllers/PaymentController');
const validator = require('../validator/payment');

router.get('/url', authentication.verifyAccessToken, paymentController.getPayUrl);
router.post('/', authentication.verifyAccessToken, validator.paymentStore, paymentController.store);

module.exports = router;
