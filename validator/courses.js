const { check } = require('express-validator');

const courseStore = [
	check('instructor', 'Instructor is required').notEmpty(),
	check('name', 'Course name must be at least 2 characters long').isLength({ min: 2 }),
	check('cover', 'Cover is require.').notEmpty(),
	check('cover', 'Cover must be a string').isString(),
	check('price', 'Price must be a positive number').isFloat({ gt: 0 }),
	check('priceSale', 'Price sale must be a positive number').isNumeric(),
	check('status', 'Status must be a string of empty string or sale or new').isIn([
		'sale',
		'new',
		'default',
	]),
	check('tags', 'Tags is required').notEmpty(),
	check('overview', 'Overview is required').notEmpty(),
	check('overview', 'Overview must be a string').isString(),
	check('requirements', 'Requirements is required').notEmpty(),
	check('requirements', 'Requirements must be a string').isString(),
	check('targetAudiences', 'Target Audiences is required').notEmpty(),
	check('targetAudiences', 'Target Audiences must be a string').isString(),
];

const courseUpdate = [
	check('name', 'Course name must be at least 2 characters long').isLength({ min: 2 }),
	check('cover', 'Cover is require.').notEmpty(),
	check('cover', 'Cover must be a string').isString(),
	check('price', 'Price must be a positive number').isFloat({ gt: 0 }),
	check('priceSale', 'Price sale must be a positive number').isNumeric(),
	check('status', 'Status must be a string of empty string or sale or new').isIn([
		'sale',
		'new',
		'default',
	]),
	check('tags', 'Tags is required').notEmpty(),
	check('overview', 'Overview is required').notEmpty(),
	check('overview', 'Overview must be a string').isString(),
	check('requirements', 'Requirements is required').notEmpty(),
	check('requirements', 'Requirements must be a string').isString(),
	check('targetAudiences', 'Target Audiences is required').notEmpty(),
	check('targetAudiences', 'Target Audiences must be a string').isString(),
];

const validator = {
	courseStore,
	courseUpdate,
};

module.exports = validator;
