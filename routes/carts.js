const express = require('express');
const router = express.Router();
const cartController = require('../app/controllers/CartController');
const validator = require('../validator/carts');
const verifyToken = require('../app/middleware/authentication');

router.get('/:userId', verifyToken, cartController.show);
router.put('/:id', verifyToken, validator.cart, cartController.update);

module.exports = router;
