const { check } = require('express-validator');

const course = [
	check('author', 'Author is require').notEmpty(),
	check('name', 'Course name must be at least 2 characters long').isLength({ min: 2 }),
	// check('cover', 'Last name is require.').notEmpty(),
	check('price', 'Price must be a positive number').isFloat({ gt: 0 }),
	check('priceSale', 'Price sale must be a positive number').isFloat({ gt: 0 }),
];

const validator = {
	course,
};

module.exports = validator;
