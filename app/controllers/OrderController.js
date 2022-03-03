const { validationResult } = require('express-validator');
const Order = require('../models/Order');

const OrderController = {
	// [GET] /api/orders/:userId
	async show(req, res) {
		const { userId } = req.params;
		try {
			const order = await Order.findOne({ userId });
			if (!order)
				return res.json({
					success: false,
					errors: [
						{
							msg: 'User ID is invalid.',
						},
					],
				});
			return res.json({ success: true, order });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [PUT] /api/orders/:id
	async update(req, res) {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({
				success: false,
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
					success: false,
					errors: [
						{
							msg: 'This course is enrolled',
						},
					],
				});
			const newItems = [...order.items, ...items];
			await Order.updateOne({ _id: id }, { items: newItems });
			return res.json({
				success: true,
				errors: [
					{
						msg: 'Updated',
					},
				],
			});
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		}
	},
};

module.exports = OrderController;
