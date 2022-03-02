const express = require('express');
const router = express.Router();
const cartController = require('../app/controllers/CartController');
const validator = require('../validator/carts');
const authToken = require('../app/middleware/auth');

router.get('/:userId', authToken, cartController.show);
router.put('/:id', authToken, validator.cart, cartController.update);

module.exports = router;
