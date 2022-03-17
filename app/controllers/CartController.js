const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Course = require('../models/Course');

const CartController = {
	// [POST] /api/cart
	async store(req, res) {
		const errors = validationResult(req);

		if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

		const {
			user: { _id },
		} = req;
		const { courseId } = req.body;

		try {
			const course = await Course.findById(courseId);
			// course not found
			if (!course)
				return res.status(400).json({ success: false, errors: [{ msg: 'Course not found' }] });

			const cartItem = await CartItem.findOne({ course: courseId });

			if (cartItem)
				return res
					.status(409)
					.json({ success: false, errors: [{ msg: 'This course already exists in your cart' }] });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		}

		try {
			const cart = await Cart.findOne({ userId: _id });
			// cart not found
			let newCart = null;
			if (!cart) {
				newCart = new Cart({
					userId: _id,
				});
				await newCart.save();
			}

			const cartItem = new CartItem({
				cartId: cart ? cart._id : newCart._id,
				course: new mongoose.Types.ObjectId(courseId),
			});
			await cartItem.save();

			return res.json({ success: true, cartItem, msg: 'Add to cart successfully' });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [GET] /api/cart/:userId
	async show(req, res) {
		const {
			user: { _id },
		} = req;
		try {
			const cart = await Cart.findOne({ userId: _id });

			if (!cart)
				return res.status(400).json({ success: false, errors: [{ msg: 'Cart not found' }] });

			const cartItems = await CartItem.find({ cartId: cart._id }).populate({
				path: 'course',
				model: 'Course',
				select: 'name cover price priceSale',
			});

			return res.json({ success: true, cart, cartItems });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		}
	},

	async removeItem(req, res) {
		const { cartItemId } = req.params;

		try {
			const cartItem = await CartItem.findByIdAndDelete(cartItemId);

			if (!cartItem)
				return res.status(400).json({ success: false, errors: [{ msg: 'Cart item not found' }] });
			return res.json({ success: true, msg: 'Cart item was removed successfully' });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		}
	},
};

module.exports = CartController;
