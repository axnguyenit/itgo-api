const { check } = require('express-validator');

const technology = [
	check('name', 'Technology name must be at least 2 characters').isLength({ min: 2 }),
	check('image', 'Image is required').notEmpty(),
	check('tag', 'Tag is required').notEmpty(),
	check('tag', 'Tag must be a string').isString(),
];

const validator = { technology };

module.exports = validator;
