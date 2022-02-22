const { check } = require('express-validator');

const validateCart = [
	check('totalCost', 'Total cost is require.').notEmpty(),
	check('items', 'Items is require.').isArray(),
];

const validator = {
	validateCart,
};

module.exports = validator;
