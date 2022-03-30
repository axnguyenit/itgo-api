const express = require('express');
const router = express.Router();
const courseController = require('../app/controllers/CourseController');
const validator = require('../validator/courses');
const { verifyAccessToken } = require('../app/middleware/authentication');
const authorization = require('../app/middleware/authorization');

router.get('/:id', courseController.show);
router.put(
	'/:id',
	verifyAccessToken,
	authorization.canUpdateCourse,
	validator.course,
	courseController.update
);
router.delete('/:id', verifyAccessToken, authorization.canUpdateCourse, courseController.destroy);
router.post(
	'/',
	verifyAccessToken,
	authorization.canCreateCourse,
	validator.course,
	courseController.store
);
router.get('/', courseController.index);

module.exports = router;
