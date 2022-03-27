const express = require('express');
const router = express.Router();
const authentication = require('../app/middleware/authentication');
const authorization = require('../app/middleware/authorization');
const validator = require('../validator/events');
const eventController = require('../app/controllers/EventController');

router.get(
	'/get-by-instructor',
	authentication.verifyAccessToken,
	authorization.isInstructor,
	eventController.getByInstructor
);
router.get('/valid-user/:id', authentication.verifyAccessToken, eventController.checkValidUser); // id --> eventId
router.get('/get-by-student/:id', authentication.verifyAccessToken, eventController.getByStudent); // id --> courseId
router.put(
	'/:id',
	authentication.verifyAccessToken,
	authorization.canUpdateEvent,
	eventController.update
);
router.delete(
	'/:id',
	authentication.verifyAccessToken,
	authorization.canUpdateEvent,
	eventController.destroy
);
router.post(
	'/',
	authentication.verifyAccessToken,
	authorization.canCreateEvent,
	validator.event,
	eventController.store
);

module.exports = router;
