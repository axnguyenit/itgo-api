const { check } = require('express-validator');

const validateRegister = [
	check('firstName', 'First name is require.').notEmpty(),
	check('firstName', 'First name must be at least 2 characters long.').isLength({ min: 2 }),
	check('lastName', 'Last name is require.').notEmpty(),
	check('lastName', 'Last name must be at least 2 characters long.').isLength({ min: 2 }),
	check('email', 'Email is require.').notEmpty(),
	check('email', 'Invalid email.').isEmail(),
	check('password', 'Password is require.').notEmpty(),
	check('password', 'Password must be at least 6 chars long.').isLength({ min: 6 }),
];

const validateLogin = [
	check('email', 'Email is require.').notEmpty(),
	check('email', 'Invalid email.').isEmail(),
	check('password', 'Password is require.').notEmpty(),
	check('password', 'Password must be at least 6 chars long.').isLength({ min: 6 }),
];

const validator = {
	validateRegister,
	validateLogin,
};

module.exports = validator;
