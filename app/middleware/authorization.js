const Course = require('../models/Course');
const User = require('../models/User');
const Cart = require('../models/Cart');

const authorization = {
	// only admin & author can update, delete course
	async canUpdateCourse(req, res, next) {
		const {
			user: { _id, isAdmin },
		} = req;
		const { id } = req.params;

		try {
			const course = await Course.findById(id);

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

			const isAuthor = _id === course.instructor;
			if (!isAuthor && !isAdmin)
				return res.status(403).json({
					success: false,
					errors: [
						{
							msg: 'Permission denied',
						},
					],
				});

			next();
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		}
	},

	// only admin & instructor can create course
	canCreateCourse(req, res, next) {
		const {
			user: { isAdmin, isInstructor },
		} = req;

		if (!isAdmin && !isInstructor)
			return res.status(403).json({
				success: false,
				errors: [
					{
						msg: 'Permission denied',
					},
				],
			});

		next();
	},

	// only author can update cart
	async canUpdateCart(req, res, next) {
		const {
			user: { _id },
		} = req;
		const { id } = req.params;

		const cart = await Cart.findById(id);
		if (!cart)
			return res.json({
				success: false,
				errors: [
					{
						msg: 'Cart not found',
					},
				],
			});

		const isAuthor = cart.userId === _id;
		if (!isAuthor)
			return res.status(403).json({
				success: false,
				errors: [
					{
						msg: 'Permission denied',
					},
				],
			});

		next();
	},
};

module.exports = authorization;
