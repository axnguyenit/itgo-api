const { check } = require('express-validator');

const validateOrder = [
	check('items', 'Items is not empty.').isArray(),
	check('items', 'Items is require.').notEmpty(),
];

const validator = {
	validateOrder,
};

module.exports = validator;
