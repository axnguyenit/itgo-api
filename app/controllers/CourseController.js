const { validationResult } = require('express-validator');
const Order = require('../models/Order');

class CourseController {
	// [GET] /api/orders/:userId --> Display the specified resource.
	async show(req, res) {
		const { userId } = req.params;
		try {
			const order = await Order.findOne({ userId });
			if (!order)
				return res.json({
					msg: 'User ID is invalid.',
				});
			return res.json(order);
		} catch (error) {
			return res.json(error);
		}
	}

	// [PUT] /api/orders/:id --> Update the specified resource in storage.
	async update(req, res) {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array(),
			});
		}

		const { id } = req.params;
		const { items } = req.body;

		try {
			const order = await Order.findById(id);
			if (!order) return;

			const enrolledCourse = items.find((item) => {
				return order.items.find((item2) => Object.values(item).includes(item2.courseId));
			});

			if (enrolledCourse)
				return res.json({
					enrolledCourse,
					msg: 'This course is enrolled',
				});
			const newItems = [...order.items, ...items];
			await Order.updateOne({ _id: id }, { items: newItems });
			return res.json({ msg: 'Updated' });
		} catch (error) {
			return res.json(error);
		}
	}
}

module.exports = new CourseController();
