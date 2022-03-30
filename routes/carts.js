const express = require('express');
const router = express.Router();
const cartController = require('../app/controllers/CartController');
const validator = require('../validator/carts');
const { verifyAccessToken } = require('../app/middleware/authentication');

router.get('/', verifyAccessToken, cartController.show);
router.delete('/:cartItemId', verifyAccessToken, cartController.removeItem);
router.post('/', verifyAccessToken, validator.cartStore, cartController.store);

module.exports = router;
