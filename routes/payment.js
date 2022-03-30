const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../app/middleware/authentication');
const paymentController = require('../app/controllers/PaymentController');
const validator = require('../validator/payment');

router.get('/url', verifyAccessToken, paymentController.getPayUrl);
router.post('/', verifyAccessToken, validator.paymentStore, paymentController.store);

module.exports = router;
