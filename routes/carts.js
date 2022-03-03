const express = require('express');
const router = express.Router();
const cartController = require('../app/controllers/CartController');
const validator = require('../validator/carts');
const verifyToken = require('../app/middleware/authentication');
const authorization = require('../app/middleware/authorization');

router.get('/', verifyToken, cartController.show);
router.put(
	'/:id',
	verifyToken,
	authorization.canUpdateCart,
	validator.cartUpdate,
	cartController.update
);
router.post('/', verifyToken, validator.cartStore, cartController.store);

module.exports = router;
