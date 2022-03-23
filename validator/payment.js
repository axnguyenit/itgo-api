const { check } = require('express-validator');

const paymentStore = [
	check('resultCode', 'Result code is required').isInt(),
	check('amount', 'Amount must be must be a integer more than 1000').isInt({ gt: 1000 }),
	check('transId', 'Transaction ID is required').notEmpty(),
	check('message', 'Message is required').notEmpty(),
	check('message', 'Message must be a string').isString(),
	check('cart', 'Cart is required').notEmpty(),
	check('cart', 'Cart must be an array').isArray(),
];

const validator = { paymentStore };

module.exports = validator;
