const { check } = require('express-validator');

const cartStore = [check('courseId', 'Course ID is required').notEmpty()];

const validator = {
	cartStore,
};

module.exports = validator;
