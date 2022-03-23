const { check } = require('express-validator');

const event = [
	check('title', 'Title must be at least 2 characters').isLength({ min: 2 }),
	check('courseId', 'Course ID is require.').notEmpty(),
	check('courseId', 'Course ID must be a string').isString(),
	check('description', 'Description is required').notEmpty(),
	check('description', 'Description must be a string').isString(),
	check('textColor', 'Text color is required').notEmpty(),
	check('textColor', 'Text color must be a string').isString(),
	check('start', 'Start time must be a date time').isString(),
	check('end', 'End time must be a date time').isString(),
	check('meetingNumber', 'Meeting number is required').notEmpty(),
	check('meetingNumber', 'Meeting number must be a string').isString(),
	check('passwordMeeting', 'Password meeting is required').notEmpty(),
	check('passwordMeeting', 'Password meeting must be a string').isString(),
];

const validator = { event };

module.exports = validator;
