const express = require('express');
const router = express.Router();
const orderController = require('../app/controllers/OrderController');
const validator = require('../validator/orders');
const verifyToken = require('../app/middleware/authentication');

router.get('/:userId', verifyToken, orderController.show);
router.put('/:id', verifyToken, validator.order, orderController.update);

module.exports = router;
