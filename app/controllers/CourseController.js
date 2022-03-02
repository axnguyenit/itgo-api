const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Course = require('../models/Course');
const CourseDetail = require('../models/CourseDetail');
const User = require('../models/User');
const Review = require('../models/Review');

class CourseController {
	// [GET] /api/courses
	async index(req, res) {
		try {
			const courses = await Course.find()
				.populate({
					path: 'author',
					model: 'User',
					select: 'email firstName lastName',
				})
				.populate({
					path: 'details',
					model: 'CourseDetail',
					populate: {
						path: 'reviews',
						model: 'Review',
					},
				});
			return res.json({ success: true, courses });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		}
	}

	// [POST] /api/courses
	async store(req, res) {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({
				success: false,
				errors: errors.array(),
			});
		}

		const { name, price, priceSale, status, tags, overview, requirements, targetAudiences } =
			req.body;

		try {
			const review = new Review({
				user: new mongoose.Types.ObjectId('621ef50a265a5b324c1dec77'),
				comment: 'this is comment',
				rating: 4.5,
			});
			await review.save();

			const courseDetails = new CourseDetail({
				overview,
				requirements,
				targetAudiences,
				reviews: review._id,
			});
			await courseDetails.save();

			const course = new Course({
				author: new mongoose.Types.ObjectId('621ef50a265a5b324c1dec77'),
				name,
				cover: 'img path',
				price,
				priceSale,
				status,
				tags,
				details: courseDetails._id,
			});
			await course.save();

			return res.json({ success: true, msg: 'Your course was created successfully' });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		}
	}

	// [GET] /api/courses/:id
	async show(req, res) {
		const { id } = req.params;
		try {
			const course = await Course.findById(id)
				.populate({
					path: 'author',
					model: 'User',
					select: 'email firstName lastName',
				})
				.populate({
					path: 'details',
					model: 'CourseDetail',
					populate: {
						path: 'reviews',
						model: 'Review',
						populate: {
							path: 'user',
							model: 'User',
							select: 'email firstName lastName',
						},
					},
				});

			if (!course)
				return res.json({
					success: false,
					errors: [
						{
							msg: 'Course ID invalid.',
						},
					],
				});
			// Get author before return course
			return res.json({ success: true, course });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		}
	}

	// [PUT] /api/courses/:id
	async update(req, res) {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({
				success: false,
				errors: errors.array(),
			});
		}

		const { id } = req.params;
	}
}

module.exports = new CourseController();
