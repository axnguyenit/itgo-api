const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../app/middleware/authentication');
const authorization = require('../app/middleware/authorization');
const validator = require('../validator/events');
const eventController = require('../app/controllers/EventController');

router.get(
	'/get-by-instructor',
	verifyAccessToken,
	authorization.isInstructor,
	eventController.getByInstructor
);
router.get('/valid-user/:id', verifyAccessToken, eventController.checkValidUser); // id --> eventId
router.get('/get-by-student/:id', verifyAccessToken, eventController.getByStudent); // id --> courseId
router.put('/:id', verifyAccessToken, authorization.canUpdateEvent, eventController.update);
router.delete('/:id', verifyAccessToken, authorization.canUpdateEvent, eventController.destroy);
router.post(
	'/',
	verifyAccessToken,
	authorization.canCreateEvent,
	validator.event,
	eventController.store
);

module.exports = router;
