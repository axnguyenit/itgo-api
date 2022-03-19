const { check } = require('express-validator');

const course = [
	check('name', 'Course name must be at least 2 characters').isLength({ min: 2 }),
	check('cover', 'Cover is require.').notEmpty(),
	check('cover', 'Cover must be a string').isString(),
	check('price', 'Price must be must be a integer more than 1000').isInt({ gt: 1000 }),
	check('priceSale', 'Price sale must be a integer more than 1000').isInt(),
	check('overview', 'Overview is required').notEmpty(),
	check('overview', 'Overview must be a string').isString(),
	check('requirements', 'Requirements is required').notEmpty(),
	check('requirements', 'Requirements must be a string').isString(),
	check('targetAudiences', 'Target Audiences is required').notEmpty(),
	check('targetAudiences', 'Target Audiences must be a string').isString(),
];

const validator = { course };

module.exports = validator;
