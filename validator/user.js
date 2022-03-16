const { check } = require('express-validator');

const register = [
	check('firstName', 'First name is required').notEmpty(),
	check('firstName', 'First name must be at least 2 characters').isLength({ min: 2 }),
	check('lastName', 'Last name is required').notEmpty(),
	check('lastName', 'Last name must be at least 2 characters').isLength({ min: 2 }),
	check('email', 'Email is required').notEmpty(),
	check('email', 'Invalid email.').isEmail(),
	check('password', 'Password is required').notEmpty(),
	check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
];

const login = [
	check('email', 'Email is required').notEmpty(),
	check('email', 'Invalid email.').isEmail(),
	check('password', 'Password is required').notEmpty(),
	check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
];

const updateAccount = [
	check('firstName', 'First name is required').notEmpty(),
	check('firstName', 'First name must be at least 2 characters').isLength({ min: 2 }),
	check('lastName', 'Last name is required').notEmpty(),
	check('lastName', 'Last name must be at least 2 characters').isLength({ min: 2 }),
	check('email', 'Email is required').notEmpty(),
	check('email', 'Invalid email.').isEmail(),
];

const changePassword = [
	check('password', 'Password is required').notEmpty(),
	check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
];

const validator = { register, login, updateAccount, changePassword };

module.exports = validator;