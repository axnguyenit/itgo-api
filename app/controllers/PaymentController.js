const crypto = require('crypto');
const https = require('https');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Payment = require('../models/Payment');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const OrderItem = require('../models/OrderItem');
const Order = require('../models/Order');
const Class = require('../models/Class');

const PaymentController = {
	// [GET] /api/payments/url
	async getPayUrl(req, res) {
		const { _id } = req.user;

		try {
			const cart = await Cart.findOne({ userId: _id });
			if (!cart) return res.status(404).json({ errors: [{ msg: 'Cart not found' }] });

			const cartItems = await CartItem.find({ cartId: cart._id }).populate({
				path: 'course',
				model: 'Course',
				select: 'name price priceSale',
			});

			if (!cartItems.length) return res.status(400).json({ errors: [{ msg: 'Cart is empty' }] });

			const amount = cartItems.reduce(
				(previous, current) =>
					previous + (current.course.priceSale ? current.course.priceSale : current.course.price),
				0
			);

			const orderInfo = cartItems.reduce(
				(previous, current) => previous + `${current.course.name}; `,
				''
			);

			const partnerCode = process.env.MOMO_PARTNER_CODE;
			const accessKey = process.env.MOMO_ACCESS_KEY;
			const secretkey = process.env.MOMO_SECRET_KEY;
			const requestType = process.env.MOMO_REQUEST_TYPE;
			const requestId = `${Date.now()}`;
			const orderId = requestId;
			const redirectUrl = process.env.MOMO_REDIRECT_URL;
			const ipnUrl = process.env.MOMO_REDIRECT_URL;
			const extraData = '';

			const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

			const signature = crypto.createHmac('sha256', secretkey).update(rawSignature).digest('hex');

			const requestBody = JSON.stringify({
				partnerCode,
				accessKey,
				requestId,
				amount,
				orderId,
				orderInfo,
				redirectUrl,
				ipnUrl,
				extraData,
				requestType,
				signature,
				lang: 'en',
			});

			const options = {
				hostname: 'test-payment.momo.vn',
				port: 443,
				path: '/v2/gateway/api/create',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': Buffer.byteLength(requestBody),
				},
			};

			// Send the request and get the response
			const request = https.request(options, (response) => {
				response.setEncoding('utf8');
				response.on('data', (body) => {
					if (response.statusCode === 200) return res.json({ payUrl: JSON.parse(body).payUrl });
				});
				response.on('end', () => {});
			});
			request.on('error', (error) => {
				console.log(error);
				return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
			});
			request.write(requestBody);
			request.end();
		} catch (error) {
			console.log(error);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [POST] /api/payments
	async store(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

		const { _id } = req.user;
		const { transId, message, amount, resultCode, cart } = req.body;

		if (resultCode && Number(resultCode) >= 0 && cart.length) {
			try {
				const paymentExist = await Payment.findOne({ transId });

				if (paymentExist)
					return res.status(409).json({ errors: [{ msg: 'This transaction already exists' }] });

				const payment = new Payment({
					userId: new mongoose.Types.ObjectId(_id),
					provider: 'MoMo',
					transId,
					message,
					amount,
				});
				await payment.save();
				if (Number(resultCode) === 0) {
					const order = new Order({
						userId: _id,
						total: amount,
						paymentId: payment._id,
					});

					await order.save();

					cart.map(async (cartItem) => {
						const orderItem = new OrderItem({
							orderId: order._id,
							userId: _id,
							course: new mongoose.Types.ObjectId(cartItem.course._id),
							price: cartItem.course.priceSale ? cartItem.course.priceSale : cartItem.course.price,
						});

						await orderItem.save();
						await CartItem.findByIdAndDelete(cartItem._id);
						await Class.findOneAndUpdate(
							{ course: cartItem.course._id },
							{ $push: { students: new mongoose.Types.ObjectId(_id) } }
						);
					});
				}

				return res.json({ msg: 'Payment was created successfully' });
			} catch (error) {
				console.log(error.message);
				return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
			}
		}
	},
};

module.exports = PaymentController;
