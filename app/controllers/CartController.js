const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Course = require('../models/Course');
const OrderItem = require('../models/OrderItem');

const CartController = {
	// [POST] /api/cart
	async store(req, res) {
		const errors = validationResult(req);

		if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

		const { _id } = req.user;
		const { courseId } = req.body;

		try {
			// User can not add a course is not exist
			const course = await Course.findById(courseId);
			// course not found
			if (!course)
				return res.status(400).json({ success: false, errors: [{ msg: 'Course not found' }] });

			const cart = await Cart.findOne({ userId: _id });
			// cart not found
			let newCart = null;
			if (!cart) {
				newCart = new Cart({ userId: _id });
				await newCart.save();
			}

			// Instructor can not add their courses to cart
			const myCourse = await Course.findOne({ instructor: _id });
			if (myCourse)
				return res
					.status(400)
					.json({ success: false, errors: [{ msg: 'You can not add your course to cart' }] });

			// User can not add a enrolled course
			const orderItem = await OrderItem.findOne({
				course: courseId,
				userId: _id,
			});
			if (orderItem)
				return res
					.status(409)
					.json({ success: false, errors: [{ msg: 'You already bought this course' }] });

			// User can not add a course is already exist
			const cartItem = await CartItem.findOne({
				course: courseId,
				cartId: cart ? cart._id : newCart._id,
			});
			if (cartItem)
				return res
					.status(409)
					.json({ success: false, errors: [{ msg: 'This course already exists in your cart' }] });

			// Create new cart item
			const newCartItem = new CartItem({
				cartId: cart ? cart._id : newCart._id,
				course: new mongoose.Types.ObjectId(courseId),
			});
			await newCartItem.save();

			return res.json({ success: true, cartItem: newCartItem, msg: 'Add to cart successfully' });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [GET] /api/cart
	async show(req, res) {
		const { _id } = req.user;
		try {
			const cart = await Cart.findOne({ userId: _id });

			// Cart not found
			if (!cart)
				return res.status(400).json({ success: false, errors: [{ msg: 'Cart not found' }] });

			// Find cart items of user
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

	// [DELETE] /api/cart/:cartItemId
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
