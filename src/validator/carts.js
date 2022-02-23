const { check } = require('express-validator');

const validateCart = [
	check('totalCost', 'Total cost is require.').notEmpty(),
	check('items', 'Items is require.').isArray(),
	check('items', 'Items is not empty.').notEmpty(),
];

const validator = {
	validateCart,
};

module.exports = validator;
