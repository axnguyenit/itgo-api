const express = require('express');
const router = express.Router();
const orderController = require('../app/controllers/OrderController');
const validator = require('../validator/orders');

router.get('/:id', orderController.show);
router.put('/:id', validator.validateLogin, orderController.update);
router.delete('/:id', orderController.destroy);
router.post('/', orderController.store);
router.get('/', orderController.index);

module.exports = router;
