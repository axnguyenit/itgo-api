const express = require('express');
const router = express.Router();
const verifyToken = require('../app/middleware/authentication');
const authorization = require('../app/middleware/authorization');
const validator = require('../validator/events');
const eventController = require('../app/controllers/EventController');

router.get(
	'/get-by-instructor',
	verifyToken,
	authorization.isInstructor,
	eventController.getByInstructor
);
router.get('/valid-user/:id', verifyToken, eventController.checkValidUser); // id --> eventId
router.get('/get-by-student/:id', verifyToken, eventController.getByStudent); // id --> courseId
router.put('/:id', verifyToken, authorization.canUpdateEvent, eventController.update);
router.delete('/:id', verifyToken, authorization.canUpdateEvent, eventController.destroy);
router.post('/', verifyToken, authorization.canCreateEvent, validator.event, eventController.store);

module.exports = router;
