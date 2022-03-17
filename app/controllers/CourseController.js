const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Course = require('../models/Course');
const CourseDetail = require('../models/CourseDetail');
const Review = require('../models/Review');
const CartItem = require('../models/CartItem');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// ----------------------------------------------------------------------

const courseController = {
	// [GET] /api/courses
	async index(req, res) {
		let _page = parseInt(req.query._page);
		let _limit = parseInt(req.query._limit);
		const _instructor = req.query._instructor;

		if (_instructor) {
			try {
				const instructor = await User.findById(_instructor);

				// Instructor not found
				if (!instructor)
					return res
						.status(400)
						.json({ success: false, errors: [{ msg: 'Instructor not found' }] });
			} catch (error) {
				console.log(error);
				return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
			}
		}

		// get courses base on _page and _limit per _page
		if (_page) {
			_page = _page >= 0 ? _page : 1;
			_limit = _limit || 1;
			_limit = _limit >= 0 ? _limit : 1;
			const skipDocs = (_page - 1) * _limit;
			let query = {};
			if (_instructor) query = { instructor: _instructor };

			try {
				const _totalRows = await Course.find(query).count();
				const courses = await Course.find(query).limit(_limit).skip(skipDocs).populate({
					path: 'instructor',
					model: 'User',
					select: 'email firstName lastName',
				});

				const pagination = { _page, _limit, _totalRows };
				return res.json({ success: true, courses, pagination });
			} catch (error) {
				console.log(error);
				return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
			}
		}

		// ----------------------------------------------------------------------

		// get all courses
		try {
			const courses = await Course.find().populate({
				path: 'instructor',
				model: 'User',
				select: 'email firstName lastName',
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

		if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

		const instructor = req.body?.instructor || req.user?._id;
		const { name, cover, price, priceSale, tags, overview, requirements, targetAudiences } =
			req.body;

		try {
			const courseDetails = new CourseDetail({
				overview,
				requirements,
				targetAudiences,
				reviews: [],
			});
			await courseDetails.save();

			const course = new Course({
				instructor: new mongoose.Types.ObjectId(instructor),
				name,
				cover,
				price,
				priceSale,
				tags,
				details: courseDetails._id,
			});
			await course.save();

			return res.json({ success: true, msg: 'Your course was created successfully' });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error 1' }] });
		}
	},

	// [GET] /api/
	async getByInstructor(req, res) {
		const { _id } = req.user;
		const _totalRows = await Course.find({ instructor: _id }).count();
		let _page = parseInt(req.query._page);
		let _limit = parseInt(req.query._limit);

		if (_page) {
			_page = _page >= 0 ? _page : 1;
			_limit = _limit || 1;
			_limit = _limit >= 0 ? _limit : 1;
			const skipDocs = (_page - 1) * _limit;

			try {
				const courses = await Course.find({ instructor: _id })
					.limit(_limit)
					.skip(skipDocs)
					.populate({
						path: 'instructor',
						model: 'User',
						select: 'email firstName lastName',
					});

				const pagination = { _page, _limit, _totalRows };
				return res.json({ success: true, courses, pagination });
			} catch (error) {
				console.log(error);
				return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
			}
		}

		// ==================================================================
		try {
			const courses = await Course.find().populate({
				path: 'instructor',
				model: 'User',
				select: 'email firstName lastName',
			});
			return res.json({ success: true, courses });
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
					path: 'instructor',
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
				return res.status(400).json({ success: false, errors: [{ msg: 'Course not found' }] });

			return res.json({ success: true, course });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error 2' }] });
		}
	},

	// [PUT] /api/courses/:id
	async update(req, res) {
		const errors = validationResult(req);

		if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

		const { id } = req.params;
		const instructor = req.body?.instructor || req.user?._id;
		const { name, price, cover, priceSale, tags, overview, requirements, targetAudiences } =
			req.body;

		try {
			const course = await Course.findByIdAndUpdate(id, {
				name,
				instructor,
				price,
				cover,
				priceSale,
				tags,
			});
			// course not found
			if (!course)
				return res.status(400).json({ success: false, errors: [{ msg: 'Course not found' }] });

			await CourseDetail.findByIdAndUpdate(course.details, {
				overview,
				requirements,
				targetAudiences,
			});

			return res.json({ success: true, msg: 'Your course was updated successfully' });
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
				return res.status(400).json({ success: false, errors: [{ msg: 'Course not found' }] });

			const { base } = path.parse(course.cover);
			fs.unlinkSync(path.join('public', 'assets', 'images', 'courses', base));

			const courseDetails = await CourseDetail.findByIdAndDelete(course.details);
			courseDetails.reviews.map(async (review) => {
				await Review.findByIdAndDelete(review);
			});

			await CartItem.deleteMany({ course: course._id });

			return res.json({ success: true, msg: 'Your course was removed successfully' });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		}
	},
};

module.exports = courseController;
