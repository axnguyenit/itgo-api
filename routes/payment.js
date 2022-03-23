const express = require('express');
const router = express.Router();
const verifyToken = require('../app/middleware/authentication');
const paymentController = require('../app/controllers/PaymentController');
const validator = require('../validator/payment');

router.get('/url', verifyToken, paymentController.getPayUrl);
router.post('/', verifyToken, validator.paymentStore, paymentController.store);

module.exports = router;
