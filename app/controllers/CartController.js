const { validationResult } = require('express-validator');
const Cart = require('../models/Cart');

const CartController = {
	// [GET] /api/cart/:userId
	async show(req, res) {
		const { userId } = req.params;
		console.log(userId);
		try {
			const cart = await Cart.findOne({ user: userId }).populate({
				path: 'user',
				select: 'email firstName lastName',
			});

			if (!cart)
				return res.json({
					success: false,
					errors: [
						{
							msg: 'User ID is invalid.',
						},
					],
				});
			return res.json({
				success: true,
				cart,
			});
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [PUT] /api/cart/:id
	async update(req, res) {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({
				success: false,
				errors: errors.array(),
			});
		}

		const { id } = req.params;

		try {
			await Cart.updateOne({ _id: id }, req.body);
			return res.json({
				success: true,
				msg: 'Updated',
			});
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		}
	},
};

module.exports = CartController;
