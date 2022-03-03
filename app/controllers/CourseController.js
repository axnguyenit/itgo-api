const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Course = require('../models/Course');
const CourseDetail = require('../models/CourseDetail');
const Review = require('../models/Review');

const courseController = {
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
	},

	// [POST] /api/courses
	async store(req, res) {
		const errors = validationResult(req);

		if (!errors.isEmpty())
			return res.status(400).json({
				success: false,
				errors: errors.array(),
			});

		const {
			author,
			name,
			price,
			priceSale,
			status,
			tags,
			overview,
			requirements,
			targetAudiences,
		} = req.body;

		try {
			const courseDetails = new CourseDetail({
				overview,
				requirements,
				targetAudiences,
				reviews: [],
			});
			await courseDetails.save();

			const course = new Course({
				author: new mongoose.Types.ObjectId(author),
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
	},

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

			// course not found
			if (!course)
				return res.json({
					success: false,
					errors: [
						{
							msg: 'Course not found',
						},
					],
				});

			return res.json({ success: true, course });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [PUT] /api/courses/:id
	async update(req, res) {
		const errors = validationResult(req);

		if (!errors.isEmpty())
			return res.status(400).json({
				success: false,
				errors: errors.array(),
			});

		const { id } = req.params;
		const { name, price, priceSale, status, tags, overview, requirements, targetAudiences } =
			req.body;
		try {
			const course = await Course.findByIdAndUpdate(id, { name, price, priceSale, status, tags });
			// course not found
			if (!course)
				return res.json({
					success: false,
					errors: [
						{
							msg: 'Course not found',
						},
					],
				});

			await CourseDetail.findByIdAndUpdate(course.details, {
				overview,
				requirements,
				targetAudiences,
			});

			return res.json({
				success: true,
				msg: 'Your course was updated successfully',
			});
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [DELETE] /api/course/:id
	async destroy(req, res) {
		const { id } = req.params;
		try {
			const course = await Course.findByIdAndDelete(id);

			// course not found
			if (!course)
				return res.status(401).json({
					success: false,
					errors: [
						{
							msg: 'Course not found',
						},
					],
				});

			const courseDetails = await CourseDetail.findByIdAndDelete(course.details);
			courseDetails.reviews.map(async (review) => {
				await Review.findByIdAndDelete(review);
			});

			return res.json({ success: true, msg: 'Your course was removed successfully' });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		}
	},
};

module.exports = courseController;
