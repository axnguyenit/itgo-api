const { check } = require('express-validator');

const roadmap = [
	check('name', 'Course name must be at least 2 characters').isLength({ min: 2 }),
	check('description', 'Description is required').notEmpty(),
	check('description', 'Description must be a string').isString(),
	check('technologies', 'Technologies is required').notEmpty(),
	check('technologies', 'Technologies must be an array').isArray(),
];

const validator = { roadmap };

module.exports = validator;
