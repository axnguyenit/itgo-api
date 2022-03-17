const crypto = require('crypto');
const https = require('https');
const { validationResult } = require('express-validator');
const Payment = require('../models/Payment');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');

const paymentController = {
	async getPayUrl(req, res) {
		const { _id } = req.user;
		let amount = 0;

		try {
			const cart = await Cart.findOne({ userId: _id });
			if (!cart)
				return res.status(404).json({ success: false, errors: [{ msg: 'Cart not found' }] });

			const cartItems = await CartItem.find({ cartId: cart._id }).populate({
				path: 'course',
				model: 'Course',
				select: 'price priceSale',
			});

			if (!cartItems.length)
				return res.status(400).json({ success: false, errors: [{ msg: 'Cart is empty' }] });
			amount = cartItems.reduce(
				(previous, current) =>
					previous + (current.course.priceSale ? current.course.priceSale : current.course.price),
				0
			);
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		}

		const partnerCode = process.env.MOMO_PARTNER_CODE;
		const accessKey = process.env.MOMO_ACCESS_KEY;
		const secretkey = process.env.MOMO_SECRET_KEY;
		const requestType = process.env.MOMO_REQUEST_TYPE;
		const requestId = `${Date.now()}`;
		const orderId = requestId;
		const orderInfo = 'Pay With MoMo';
		const redirectUrl = process.env.MOMO_REDIRECT_URL;
		const ipnUrl = 'http://127.0.0.1:8000/';
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

		//Send the request and get the response
		const request = https.request(options, (response) => {
			response.setEncoding('utf8');
			response.on('data', (body) => {
				if (response.statusCode === 200)
					return res.json({ success: true, payUrl: JSON.parse(body).payUrl });
			});
			response.on('end', () => {});
		});

		request.on('error', (error) => {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		});
		// write data to request body
		request.write(requestBody);
		request.end();
	},
};

module.exports = paymentController;
