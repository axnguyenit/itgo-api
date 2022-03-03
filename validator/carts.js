const { check } = require('express-validator');

const cartUpdate = [
	check('total', 'Total is required').notEmpty(),
	check('total', 'Total must be a positive number').isFloat({ gt: 0 }),
	check('cartItemId', 'Course item ID is required').notEmpty(),
];

const cartStore = [
	check('total', 'Total is required').notEmpty(),
	check('total', 'Total must be a positive number').isFloat({ gt: 0 }),
	check('courseId', 'Course ID is required').notEmpty(),
];

const validator = {
	cartUpdate,
	cartStore,
};

module.exports = validator;
