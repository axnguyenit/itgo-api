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
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			const { firstName, lastName, email, password, confirmPassword } = req.body;
			const user = await User.findOne({ email: email });

			// Validate if user already exist
			if (user) {
				return res
					.status(409)
					.json({ errors: [{ email: user.email, msg: 'The user already exist' }] });
			}

			if (password !== confirmPassword)
				return res.status(401).json({ errors: [{ msg: 'Confirm password not match' }] });

			// Hash password before saving to database
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);

			const data = {
				firstName,
				lastName,
				email,
				password: hashedPassword,
			};

			// Save user info to database

			const newUser = new User(data);
			await newUser.save();

			const secret = `${process.env.ACCESS_TOKEN_SECRET}${newUser.emailVerified}`;
			const token = JWT.sign({ email }, secret, { expiresIn: '10m' });
			const verifyEmailLink = `${process.env.CLIENT_URL}/auth/verify/${newUser._id}/${token}`;

			const mailOptions = {
				from: 'ITGO',
				to: email,
				subject: 'ITGO - Verify email',
				template: 'verify-email',
				context: {
					firstName: newUser.firstName,
					verifyEmailLink,
				},
			};

			await transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.error(error.message);
					return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
				} else {
					return res.json({
						email,
						msg: `We have sent a verify email link to ${email}`,
					});
				}
			});

			return res.json({ msg: 'Registered an account successfully' });
		} catch (error) {
			console.error(error.message);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [POST] /api/auth/login
	async login(req, res) {
		const errors = validationResult(req);
		// Validate user input
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

		try {
			const { email, password } = req.body;
			const user = await User.findOne({ email: email });

			// user not found
			if (!user) return res.status(400).json({ errors: [{ msg: 'User do not exist' }] });

			// Compare hased password with user password to see if they are valid
			const isMatch = await bcrypt.compareSync(password, user.password);

			if (!isMatch)
				return res.status(401).json({ errors: [{ msg: 'Email or password is invalid' }] });

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
				isApply,
			} = user;

			// Send JWT access token
			const accessToken = await JWT.sign(
				{ _id, firstName, lastName, email, isAdmin, isInstructor },
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: '3h' }
			);

			// Refresh token
			const refreshToken = await JWT.sign(
				{ _id, firstName, lastName, email },
				process.env.REFRESH_TOKEN_SECRET,
				{
					expiresIn: '7d',
				}
			);

			return res.json({
				user: {
					_id,
					firstName,
					lastName,
					isAdmin,
					email,
					avatar,
					region,
					address,
					isApply,
					phoneNumber,
					isInstructor,
					emailVerified,
				},
				accessToken,
				refreshToken,
			});
		} catch (error) {
			console.error(error);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [POST] /api/auth/verify
	async requestVerifyEmail(req, res) {
		const { email } = req.body;

		try {
			const user = await User.findOne({ email });

			// User not found
			if (!user) return res.status(400).json({ errors: [{ msg: 'User not registered' }] });

			const secret = `${process.env.ACCESS_TOKEN_SECRET}${user.emailVerified}`;
			const token = JWT.sign({ email }, secret, { expiresIn: '10m' });
			const verifyEmailLink = `${process.env.CLIENT_URL}/auth/verify/${user._id}/${token}`;

			const mailOptions = {
				from: 'ITGO',
				to: email,
				subject: 'ITGO - Verify email',
				template: 'verify-email',
				context: {
					firstName: user.firstName,
					verifyEmailLink,
				},
			};

			await transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.error(error);
					return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
				} else {
					return res.json({
						email,
						msg: `We have sent a verify email link to ${email}`,
					});
				}
			});
		} catch (error) {
			console.error(error.message);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [POST] /api/auth/verify/:id/:token
	async verifyEmail(req, res) {
		const { id, token } = req.params;

		try {
			const user = await User.findById(id);

			// User not found
			if (!user) return res.status(400).json({ errors: [{ msg: 'User not found' }] });

			if (user.emailVerified) return res.json({});

			const secret = `${process.env.ACCESS_TOKEN_SECRET}${user.emailVerified}`;
			await JWT.verify(token, secret);
			await User.findByIdAndUpdate(id, { emailVerified: true });

			return res.json({});
		} catch (error) {
			console.error(error.message);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [POST] /api/auth/forgot-password
	async forgotPassword(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

		const { email } = req.body;

		try {
			const user = await User.findOne({ email });

			// User not found
			if (!user) return res.status(400).json({ errors: [{ msg: 'User not registered' }] });

			const secret = `${process.env.ACCESS_TOKEN_SECRET}${user.password}`;
			const token = JWT.sign({ email }, secret, { expiresIn: '10m' });
			const resetPasswordLink = `${process.env.CLIENT_URL}/auth/reset-password/${user._id}/${token}`;

			const mailOptions = {
				from: 'ITGO',
				to: email,
				subject: 'ITGO - Reset password',
				template: 'reset-password',
				context: {
					firstName: user.firstName,
					email,
					resetPasswordLink,
				},
			};

			await transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.error(error);
					return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
				} else {
					return res.json({
						email,
						msg: `We have sent a reset password link to ${email}`,
					});
				}
			});
		} catch (error) {
			console.error(error.message);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [GET] /api/auth/reset-password/:id/:token
	async checkRequestResetPassword(req, res) {
		const { id, token } = req.params;

		try {
			const user = await User.findById(id);

			// User not found
			if (!user) return res.status(400).json({ errors: [{ msg: 'User not found' }] });

			const secret = `${process.env.ACCESS_TOKEN_SECRET}${user.password}`;
			await JWT.verify(token, secret);

			return res.json({});
		} catch (error) {
			console.error(error.message);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [POST] /api/auth/reset-password/:id/:token
	async resetPassword(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

		const { id, token } = req.params;
		const { password, confirmPassword } = req.body;

		if (password !== confirmPassword)
			return res.status(400).json({ errors: [{ msg: 'Confirm password not match' }] });

		try {
			// Hash password before saving to database
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			const user = await User.findById(id);

			// User not found
			if (!user) return res.status(400).json({ errors: [{ msg: 'User not found' }] });

			const secret = `${process.env.ACCESS_TOKEN_SECRET}${user.password}`;
			await JWT.verify(token, secret);
			await User.findByIdAndUpdate(id, { password: hashedPassword });

			return res.json({ msg: 'Password was reset successfully' });
		} catch (error) {
			console.error(error.message);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [POST] /api/auth/refresh-token
	// create new access token from refresh token
	async refreshToken(req, res) {
		const { _id, firstName, lastName, email } = req.user;

		try {
			const user = await User.findById(_id);
			// user not found
			if (!user) return res.status(400).json({ errors: [{ msg: 'User do not exist' }] });

			// Send JWT access token
			const accessToken = await JWT.sign(
				{
					_id,
					firstName,
					lastName,
					email,
					isAdmin: user.isAdmin,
					isInstructor: user.isInstructor,
				},
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: '3h' }
			);

			return res.json({ accessToken });
		} catch (error) {
			console.error(error.message);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},
};

module.exports = AuthController;
