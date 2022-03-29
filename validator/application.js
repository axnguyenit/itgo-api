const { check } = require('express-validator');

const application = [
	check('position', 'Position must be at least 2 characters').isLength({ min: 2 }),
	check('cv', 'CV is required').notEmpty(),
];

const validator = { application };

module.exports = validator;
