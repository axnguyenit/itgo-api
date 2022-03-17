const express = require('express');
const router = express.Router();
const verifyToken = require('../app/middleware/authentication');
const paymentController = require('../app/controllers/PaymentController');

router.get('/url', verifyToken, paymentController.getPayUrl);

module.exports = router;
