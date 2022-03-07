const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const User = require('../models/User');

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

		const { firstName, lastName, email, password } = req.body;
		const user = await User.findOne({ email: email });

		// Validate if user already exists
		if (user) {
			return res.status(200).json({
				success: false,
				errors: [
					{
						email: user.email,
						msg: 'The user already exists',
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
		try {
			const newUser = new User(data);
			await newUser.save();

			const { _id, firstName, lastName, isAdmin, isInstructor, emailVerified } = newUser;
			// Do not include sensitive information in JWT
			const accessToken = await JWT.sign(
				{ _id, firstName, lastName, email, isAdmin, isInstructor },
				process.env.ACCESS_TOKEN_SECRET,
				{
					expiresIn: '1h',
				}
			);

			// const order = new Order({ userId: newUser._id });
			// await order.save();

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
				return res.status(400).json({
					success: false,
					errors: [
						{
							msg: 'Invalid credentials',
						},
					],
				});

			// Compare hased password with user password to see if they are valid
			const isMatch = await bcrypt.compareSync(password, user.password);

			if (!isMatch)
				return res.status(401).json({
					success: false,
					errors: [
						{
							msg: 'Email or password is invalid.',
						},
					],
				});

			const { _id, firstName, lastName, isAdmin, isInstructor, emailVerified } = user;

			// Send JWT access token
			const accessToken = await JWT.sign(
				{ _id, firstName, lastName, email, isAdmin, isInstructor },
				process.env.ACCESS_TOKEN_SECRET,
				{
					expiresIn: '1h',
				}
			);

			// Refresh token
			// const refreshToken = await JWT.sign({ email }, process.env.REFRESH_TOKEN_SECRET, {
			// 	expiresIn: '3d',
			// });

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
				},
				accessToken,
				// refreshToken,
			});

			// Set refersh token in refreshTokens array
			// User.updateOne({ email: user.email }, { refreshToken: refreshToken })
			// 	.then(() =>
			// 		res.json({
			// 			success: true,
			// 			accessToken,
			// 			refreshToken,
			// 		})
			// 	)
			// 	.catch((error) =>
			// 		res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] })
			// 	);
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		}
	},

	async myAccount(req, res) {
		const {
			user: { _id },
		} = req;
		try {
			const user = await User.findById(_id);

			// user not found
			if (!user)
				return res.status(400).json({
					success: false,
					errors: [
						{
							msg: 'Invalid credentials',
						},
					],
				});

			const { firstName, lastName, email, isAdmin, isInstructor, emailVerified } = user;

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
				},
			});
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		}
	},

	// async logout(req, res) {
	// 	const refreshToken = req.header('x-auth-token');

	// 	try {
	// 		const user = await JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
	// 		if (user.email) {
	// 			User.updateOne({ email: user.email }, { refreshToken: '' })
	// 				.then(() => {
	// 					res.sendStatus(200);
	// 				})
	// 				.catch((err) => res.json(err));
	// 		}
	// 	} catch (error) {
	// 		res.status(403).json({
	// 			errors: [
	// 				{
	// 					msg: 'Invalid token',
	// 				},
	// 			],
	// 		});
	// 	}
	// }
};

module.exports = AuthController;
