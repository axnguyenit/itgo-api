const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Course = require('../models/Course');

const CartController = {
	// [POST] /api/cart
	async store(req, res) {
		const errors = validationResult(req);

		if (!errors.isEmpty())
			return res.status(400).json({
				success: false,
				errors: errors.array(),
			});

		const {
			user: { _id },
		} = req;
		const { courseId, total } = req.body;

		try {
			const course = await Course.findById(courseId);
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

			const cartItem = await CartItem.findOne({ course: courseId });

			if (cartItem)
				return res.json({
					success: false,
					errors: [
						{
							msg: 'This course already exists in your cart',
						},
					],
				});
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		}

		try {
			const cart = await Cart.findOneAndUpdate({ userId: _id }, { total });
			// cart not found
			let newCart = null;
			if (!cart) {
				newCart = new Cart({
					userId: _id,
					total,
				});
				await newCart.save();
			}

			const cartItem = new CartItem({
				cartId: cart ? cart._id : newCart._id,
				course: new mongoose.Types.ObjectId(courseId),
			});
			await cartItem.save();

			return res.json({ success: true, msg: 'Add to cart successfully' });
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
				return res.json({
					success: false,
					errors: [
						{
							msg: 'Cart not found',
						},
					],
				});

			const cartItems = await CartItem.find({ cartId: cart._id }).populate({
				path: 'course',
				model: 'Course',
				select: 'name cover price priceSale',
			});

			return res.json({
				success: true,
				cart,
				cartItems,
			});
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		}
	},

	async update(req, res) {
		const { id } = req.params;
		const { cartItemId, total } = req.body;

		try {
			// update cart total
			const cart = await Cart.findByIdAndUpdate(id, { total });
			if (!cart)
				return res.json({
					success: false,
					errors: [
						{
							msg: 'Cart not found',
						},
					],
				});

			// delete cart item
			await CartItem.findOneAndDelete({ _id: cartItemId, cartId: id });

			const cartItems = await CartItem.find({ cartId: id }).populate({
				path: 'course',
				model: 'Course',
				select: 'name cover price priceSale',
			});

			console.log(cartItems.length);

			if (cartItems.length === 0) {
				await Cart.findByIdAndDelete(id);
			}

			return res.json({
				success: true,
				msg: 'Course was removed successfully',
			});
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		}
	},
};

module.exports = CartController;
