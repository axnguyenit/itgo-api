const { validationResult } = require('express-validator');
const Cart = require('../models/Cart');

class CartController {
	// [GET] /api/cart/:userId --> Display the specified resource.
	async show(req, res) {
		const { userId } = req.params;
		try {
			const cart = await Cart.findOne({ userId });
			if (!cart)
				res.json({
					msg: 'User ID is invalid.',
				});
			else res.json(cart);
		} catch (error) {
			res.json(error);
		}
	}

	// [PUT] /api/cart/:id --> Update the specified resource in storage.
	async update(req, res) {
		const { id } = req.params;
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array(),
			});
		}

		try {
			await Cart.updateOne({ _id: id }, req.body);
			res.json({
				msg: 'Updated',
			});
		} catch (error) {
			res.json(error);
		}
	}
}

module.exports = new CartController();
