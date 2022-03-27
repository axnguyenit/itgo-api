const express = require('express');
const router = express.Router();
const cartController = require('../app/controllers/CartController');
const validator = require('../validator/carts');
const authentication = require('../app/middleware/authentication');

router.get('/', authentication.verifyAccessToken, cartController.show);
router.delete('/:cartItemId', authentication.verifyAccessToken, cartController.removeItem);
router.post('/', authentication.verifyAccessToken, validator.cartStore, cartController.store);

module.exports = router;
