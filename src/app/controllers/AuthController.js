const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const User = require('../models/User');

// const users = [];

class AuthController {
	// [POST] /auth/register
	async register(req, res, next) {
		const { firstName, lastName, email, password } = req.body;
		const errors = validationResult(req);

		// Validate user input
		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array(),
			});
		}

		const user = await User.findOne({ email: email });

		// Validate if user already exists

		if (user) {
			// 422 Unprocessable Entity: server understands the content type of the request entity
			// 200 Ok: Gmail, Facebook, Amazon, Twitter are returning 200 for user already exists
			return res.status(200).json({
				errors: [
					{
						email: user.email,
						message: 'The user already exists',
					},
				],
			});
		}

		// Hash password before saving to database
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const data = {
			firstName,
			lastName,
			email,
			password: hashedPassword,
			refreshToken: '',
		};

		// Save user info to database
		const newUser = new User(data);
		newUser.save(async (err) => {
			if (err) return;
			// Do not include sensitive information in JWT
			const accessToken = await JWT.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
				expiresIn: '1h',
			});

			res.json({
				accessToken,
			});
		});
	}

	// [POST] /auth/login
	async login(req, res, next) {
		const { email, password } = req.body;
		// Look for user email in the database
		const user = await User.findOne({ email: email });

		// If user not found, send error message
		if (!user) {
			return res.status(400).json({
				errors: [
					{
						message: 'Invalid credentials',
					},
				],
			});
		}

		// Compare hased password with user password to see if they are valid
		let isMatch = await bcrypt.compareSync(password, user.password);

		if (!isMatch) {
			return res.status(401).json({
				errors: [
					{
						message: 'Email or password is invalid.',
					},
				],
			});
		}

		// Send JWT access token
		const accessToken = await JWT.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
			expiresIn: '1h',
		});

		// Refresh token
		const refreshToken = await JWT.sign({ email }, process.env.REFRESH_TOKEN_SECRET, {
			expiresIn: '3d',
		});

		// Set refersh token in refreshTokens array
		User.updateOne({ email: user.email }, { refreshToken: refreshToken })
			.then(() =>
				res.json({
					accessToken,
					refreshToken,
				})
			)
			.catch((err) => console.log(err));
	}

	async logout(req, res, next) {
		const refreshToken = req.header('x-auth-token');

		try {
			const user = await JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
			if (user.email) {
				User.updateOne({ email: user.email }, { refreshToken: '' })
					.then(() => {
						res.sendStatus(200);
					})
					.catch((err) => console.log(err));
			}
		} catch (error) {
			res.status(403).json({
				errors: [
					{
						message: 'Invalid token',
					},
				],
			});
		}
	}
}

module.exports = new AuthController();
