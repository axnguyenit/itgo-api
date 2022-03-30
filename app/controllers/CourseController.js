const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Course = require('../models/Course');
const CourseDetail = require('../models/CourseDetail');
const Review = require('../models/Review');
const CartItem = require('../models/CartItem');
const User = require('../models/User');
const Class = require('../models/Class');
const cloudinary = require('../../config/cloudinary');

// ----------------------------------------------------------------------

const CourseController = {
	// [GET] /api/courses
	async index(req, res) {
		let _page = parseInt(req.query._page);
		let _limit = parseInt(req.query._limit);
		const { _tags, _instructor } = req.query;
		let query = {};

		if (_instructor) {
			try {
				const instructor = await User.findById(_instructor);

				// Instructor not found
				if (!instructor) return res.status(400).json({ errors: [{ msg: 'Instructor not found' }] });
				query = { instructor: _instructor };
			} catch (error) {
				console.log(error);
				return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
			}
		}

		if (_tags) query = { ...query, tags: { $regex: _tags, $options: 'i' } };

		// get courses base on _page and _limit per _page
		if (_page) {
			_page = _page >= 0 ? _page : 1;
			_limit = _limit || 1;
			_limit = _limit >= 0 ? _limit : 1;
			const skipDocs = (_page - 1) * _limit;

			try {
				const _totalRows = await Course.find(query).count();
				const courses = await Course.find(query)
					.sort({ createdAt: -1 })
					.limit(_limit)
					.skip(skipDocs)
					.populate({
						path: 'instructor',
						model: 'User',
						select: 'email firstName lastName',
					});

				const pagination = { _page, _limit, _totalRows };
				return res.json({ courses, pagination });
			} catch (error) {
				console.log(error);
				return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
			}
		}

		// ----------------------------------------------------------------------

		// get all courses
		try {
			const courses = await Course.find(query).sort({ createdAt: -1 }).populate({
				path: 'instructor',
				model: 'User',
				select: 'email firstName lastName',
			});
			return res.json({ courses });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [POST] /api/courses
	async store(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

		const instructor = req.body?.instructor || req.user?._id;
		const {
			name,
			cover,
			price,
			priceSale,
			tags,
			overview,
			requirements,
			targetAudiences,
			minStudent,
		} = req.body;

		try {
			const response = await cloudinary.uploader.upload(cover, {
				folder: 'itgo/courses',
				resource_type: 'image',
			});
			const newCover = response.public_id;

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
				cover: newCover,
				price,
				priceSale,
				minStudent,
				tags,
				details: courseDetails._id,
			});
			await course.save();

			// create class
			const classCourse = new Class({
				instructor: course.instructor,
				students: [],
				course: course._id,
			});

			await classCourse.save();

			return res.json({ msg: 'Course was created successfully' });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
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
			if (!course) return res.status(400).json({ errors: [{ msg: 'Course not found' }] });

			return res.json({ course });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ errors: [{ msg: 'Internal server error 2' }] });
		}
	},

	// [PUT] /api/courses/:id
	async update(req, res) {
		const errors = validationResult(req);

		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

		const { id } = req.params;
		const instructor = req.body?.instructor || req.user?._id;
		const {
			name,
			price,
			cover,
			priceSale,
			minStudent,
			tags,
			overview,
			requirements,
			targetAudiences,
		} = req.body;

		try {
			let newCover = '';
			if (cover.startsWith('data:')) {
				const response = await cloudinary.uploader.upload(cover, {
					folder: 'itgo/courses',
					resource_type: 'image',
				});
				newCover = response.public_id;
			}

			const course = await Course.findByIdAndUpdate(id, {
				name,
				instructor,
				cover: cover.startsWith('data:') ? newCover : cover,
				price,
				priceSale,
				minStudent,
				tags,
			});

			await CourseDetail.findByIdAndUpdate(course.details, {
				overview,
				requirements,
				targetAudiences,
			});

			return res.json({ msg: 'Your course was updated successfully' });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [DELETE] /api/course/:id
	async destroy(req, res) {
		const { id } = req.params;
		try {
			const course = await Course.findByIdAndDelete(id);

			const courseDetails = await CourseDetail.findByIdAndDelete(course.details);
			courseDetails.reviews.map(async (review) => await Review.findByIdAndDelete(review));

			await CartItem.deleteMany({ course: id });
			await Class.findOneAndRemove({ course: id });

			return res.json({ msg: 'Course was removed successfully' });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},
};

module.exports = CourseController;
