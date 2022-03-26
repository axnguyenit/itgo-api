const { check } = require('express-validator');

const technology = [
	check('name', 'Course name must be at least 2 characters').isLength({ min: 2 }),
	check('image', 'Slogan is required').notEmpty(),
	check('tag', 'Tag is required').notEmpty(),
	check('tag', 'Tag must be a string').isString(),
];

const validator = { technology };

module.exports = validator;
