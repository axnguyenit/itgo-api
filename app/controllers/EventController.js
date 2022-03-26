const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Class = require('../models/Class');
const Event = require('../models/Event');

const EventController = {
	// [GET] /api/events/get-by-instructor
	async getByInstructor(req, res) {
		const { _id } = req.user;

		try {
			const events = await Event.find({ instructor: _id });
			return res.json({ events });
		} catch (error) {
			console.log(error.message);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [GET] /api/events/get-by-student/:id --> courseId
	async getByStudent(req, res) {
		const { _id } = req.user;
		const { id } = req.params;
		try {
			const classes = await Class.findOne({ students: { $in: [_id] }, course: id });
			if (!classes) return res.status(403).json({ errors: [{ msg: 'Permission denied' }] });

			const events = await Event.find({ course: id });

			return res.json({ events });
		} catch (error) {
			console.log(error.message);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [GET] /api/events/valid-user/:id --> eventId
	// Verify that the user can join meeting
	async checkValidUser(req, res) {
		try {
			const { _id, firstName, lastName, email, isAdmin } = req.user;
			const { id } = req.params;

			const event = await Event.findById(id).populate({
				path: 'course',
				model: 'Course',
				select: 'cover',
			});

			const { meetingNumber, passwordMeeting, course } = event;

			if (_id === event.instructor || isAdmin) {
				const name = `${firstName} ${lastName} - ${isAdmin ? 'Admin' : 'Instructor'}`;
				return res.json({
					meetingNumber,
					passwordMeeting,
					cover: event.course.cover,
					role: 0,
					name,
					email,
				});
			}

			const classes = await Class.findOne({ students: { $in: [_id] }, course: course })
				.populate({
					path: 'course',
					model: 'Course',
					select: 'cover',
				})
				.populate({
					path: 'students',
					model: 'User',
					select: 'firstName lastName email',
				});
			if (!classes) return res.status(403).json({ errors: [{ msg: 'Permission denied' }] });
			const user = classes.students.find((student) => student._id.toString() === _id);
			const name = `${user.firstName} ${user.lastName}`;

			return res.json({
				meetingNumber,
				passwordMeeting,
				cover: classes.course.cover,
				role: 0,
				name,
				email: user.email,
			});
		} catch (error) {
			console.log(error.message);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [POST] /api/events
	async store(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

		const { _id } = req.user;
		const { title, description, textColor, courseId, start, end, meetingNumber, passwordMeeting } =
			req.body;

		try {
			const event = new Event({
				title,
				description,
				instructor: _id,
				textColor,
				course: new mongoose.Types.ObjectId(courseId),
				start,
				end,
				meetingNumber,
				passwordMeeting,
			});

			await event.save();

			return res.json({ event, msg: 'Event was created successfully' });
		} catch (error) {
			console.log(error.message);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [PUT] /api/events/:id
	async update(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

		const { id } = req.params;
		const { title, description, textColor, courseId, start, end, meetingNumber, passwordMeeting } =
			req.body;

		try {
			await Event.findByIdAndUpdate(id, {
				title,
				description,
				textColor,
				course: new mongoose.Types.ObjectId(courseId),
				start,
				end,
				meetingNumber,
				passwordMeeting,
			});

			return res.json({ msg: 'Event was updated successfully' });
		} catch (error) {
			console.log(error.message);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [DELETE] /api/events/:id
	async destroy(req, res) {
		const { id } = req.params;

		try {
			const event = await Event.findByIdAndDelete(id);
			return res.json({ event, msg: 'Event was removed successfully' });
		} catch (error) {
			console.log(error.message);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},
};

module.exports = EventController;
