const { check } = require('express-validator');

const validateRegister = [
	check('firstName', 'First name is require.').not().isEmpty(),
	check('lastName', 'Last name is require.').not().isEmpty(),
	check('email', 'Invalid email.').isEmail(),
	check('password', 'Password must be at least 6 chars long.').isLength({ min: 6 }),
];

const validateLogin = [
	check('email', 'Email is require.').not().isEmpty(),
	check('email', 'Invalid email.').isEmail(),
	check('password', 'Password must be at least 6 chars long.').isLength({ min: 6 }),
];

const validator = {
	validateRegister,
	validateLogin,
};

module.exports = validator;
