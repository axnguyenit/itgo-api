const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const User = require('../models/User');
const transporter = require('../../config/nodemailer');

const AuthController = {
	// [POST] /api/auth/register
	async register(req, res) {
		const errors = validationResult(req);
		// Validate user input
		if (!errors.isEmpty()) {
			return res.status(400).json({
				success: false,
				errors: errors.array(),
			});
		}

		const { firstName, lastName, email, password, confirmPassword } = req.body;
		const user = await User.findOne({ email: email });

		// Validate if user already exist
		if (user) {
			return res
				.status(409)
				.json({ success: false, errors: [{ email: user.email, msg: 'The user already exist' }] });
		}

		if (password !== confirmPassword)
			return res
				.status(400)
				.json({ success: false, errors: [{ msg: 'Confirm password not match' }] });

		// Hash password before saving to database
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const data = {
			firstName,
			lastName,
			email,
			password: hashedPassword,
			avatar: '',
			address: '',
			phoneNumber: '',
			region: '',
		};

		// Save user info to database
		try {
			const newUser = new User(data);
			await newUser.save();

			const {
				_id,
				firstName,
				lastName,
				isAdmin,
				isInstructor,
				emailVerified,
				avatar,
				address,
				phoneNumber,
				region,
			} = newUser;
			// Do not include sensitive information in JWT
			const accessToken = await JWT.sign(
				{ _id, firstName, lastName, email, isAdmin, isInstructor },
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: '12h' }
			);

			return res.json({
				success: true,
				user: {
					_id,
					firstName,
					lastName,
					isAdmin,
					isInstructor,
					email,
					emailVerified,
					avatar,
					address,
					phoneNumber,
					region,
				},
				accessToken,
			});
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [POST] /api/auth/login
	async login(req, res) {
		const errors = validationResult(req);
		// Validate user input
		if (!errors.isEmpty())
			return res.status(400).json({
				success: false,
				errors: errors.array(),
			});

		try {
			const { email, password } = req.body;
			const user = await User.findOne({ email: email });

			// user not found
			if (!user)
				return res.status(400).json({ success: false, errors: [{ msg: 'User do not exist' }] });

			// Compare hased password with user password to see if they are valid
			const isMatch = await bcrypt.compareSync(password, user.password);

			if (!isMatch)
				return res
					.status(401)
					.json({ success: false, errors: [{ msg: 'Email or password is invalid.' }] });

			const {
				_id,
				firstName,
				lastName,
				isAdmin,
				isInstructor,
				emailVerified,
				avatar,
				address,
				phoneNumber,
				region,
			} = user;

			// Send JWT access token
			const accessToken = await JWT.sign(
				{ _id, firstName, lastName, email, isAdmin, isInstructor },
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: '12h' }
			);

			return res.json({
				success: true,
				user: {
					_id,
					firstName,
					lastName,
					isAdmin,
					isInstructor,
					email,
					emailVerified,
					avatar,
					address,
					phoneNumber,
					region,
				},
				accessToken,
			});
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [POST] /api/auth/verify-email
	async verifyEmail(req, res) {},

	// [POST] /api/
	async forgotPassword(req, res) {
		const { email } = req.body;

		try {
			const user = await User.findOne({ email });

			// User not found
			if (!user)
				return res.status(400).json({ success: false, errors: [{ msg: 'User not registered' }] });

			const secret = `${process.env.ACCESS_TOKEN_SECRET}${user.password}`;
			const token = JWT.sign({ email }, secret, { expiresIn: '10m' });
			const resetPasswordLink = `${process.env.CLIENT_URL}/auth/reset-password/${user._id}/${token}`;

			const mailOptions = {
				from: 'ITGO',
				to: email,
				subject: 'ITGO - Request to reset password',
				template: 'reset-password',
				context: {
					firstName: user.firstName,
					email,
					resetPasswordLink,
				},
			};

			await transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.log(error);
					return res
						.status(500)
						.json({ success: false, errors: [{ msg: 'Internal server error' }] });
				} else {
					console.log('Email sent: ' + info.response);
					return res.json({
						success: true,
						email,
						msg: `We have sent a reset password link to ${email}`,
					});
				}
			});
		} catch (error) {
			console.log(error.message);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [GET] /api/auth/reset-password/:id/:token
	async checkRequestResetPassword(req, res) {
		const { id, token } = req.params;

		try {
			const user = await User.findById(id);

			// User not found
			if (!user)
				return res.status(400).json({ success: false, errors: [{ msg: 'User not found' }] });

			const secret = `${process.env.ACCESS_TOKEN_SECRET}${user.password}`;
			await JWT.verify(token, secret);

			return res.json({ success: true });
		} catch (error) {
			console.log(error.message);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [POST] /api/auth/reset-password/:id/:token
	async resetPassword(req, res) {
		const { id, token } = req.params;
		const { password, confirmPassword } = req.body;
		console.log(req.body);

		if (password !== confirmPassword)
			return res
				.status(400)
				.json({ success: false, errors: [{ msg: 'Confirm password not match' }] });

		try {
			// Hash password before saving to database
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			const user = await User.findByIdAndUpdate(id, { password: hashedPassword });

			// User not found
			if (!user)
				return res.status(400).json({ success: false, errors: [{ msg: 'User not found' }] });

			const secret = `${process.env.ACCESS_TOKEN_SECRET}${user.password}`;
			await JWT.verify(token, secret);

			return res.json({ success: true, msg: 'Password was reset successfully' });
		} catch (error) {
			console.log(error.message);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		}
	},
};

module.exports = AuthController;
