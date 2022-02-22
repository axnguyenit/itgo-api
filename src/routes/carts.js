const express = require('express');
const router = express.Router();
const cartController = require('../app/controllers/CartController');
const validator = require('../validator/carts');

router.get('/:userId', cartController.show);
router.put('/:id', validator.validateCart, cartController.update);

module.exports = router;
