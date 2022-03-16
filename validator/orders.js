const { check } = require('express-validator');

const order = [
	check('items', 'Items is not empty.').isArray(),
	check('items', 'Items is require.').notEmpty(),
];

const validator = { order };

module.exports = validator;
