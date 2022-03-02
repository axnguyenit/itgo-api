const express = require('express');
const router = express.Router();
const orderController = require('../app/controllers/OrderController');
const validator = require('../validator/orders');
const authToken = require('../app/middleware/auth');

router.get('/:userId', authToken, orderController.show);
router.put('/:id', authToken, validator.order, orderController.update);

module.exports = router;
