const { validationResult } = require('express-validator');
const cloudinary = require('../../config/cloudinary');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const UserController = {
	async index(req, res) {
		let _page = parseInt(req.query._page);
		let _limit = parseInt(req.query._limit);
		const query = { isAdmin: false };

		// get users base on _page and _limit per _page
		if (_page) {
			_page = _page >= 0 ? _page : 1;
			_limit = _limit || 1;
			_limit = _limit >= 0 ? _limit : 1;
			const skipDocs = (_page - 1) * _limit;

			try {
				const _totalRows = await User.find(query).count();
				const users = await User.find(query)
					.sort({ createdAt: -1 })
					.limit(_limit)
					.skip(skipDocs)
					.select('firstName lastName email isInstructor emailVerified avatar position isBanned');

				const pagination = { _page, _limit, _totalRows };
				return res.json({ users, pagination });
			} catch (error) {
				console.log(error);
				return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
			}
		}

		// ----------------------------------------------------------------------

		// get all users
		try {
			const users = await User.find(query)
				.sort({ createdAt: -1 })
				.select('firstName lastName email isInstructor emailVerified avatar position isBanned');
			return res.json({ users });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [GET] /api/users/my-account
	async myAccount(req, res) {
		const { _id } = req.user;
		try {
			const user = await User.findById(_id).select(
				'firstName lastName email isAdmin isInstructor emailVerified avatar address phoneNumber region isApply'
			);

			// user not found
			if (!user) return res.status(400).json({ errors: [{ msg: 'User do not exist' }] });

			return res.json({ user });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [GET] /api/users/:id
	async show(req, res) {
		const { id } = req.params;

		try {
			const user = await User.findById(id).select(
				'firstName lastName avatar position address region'
			);

			// user not found
			if (!user) return res.status(400).json({ errors: [{ msg: 'User not found' }] });

			return res.json({ user });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [PUT] /api/users/:id
	async updateAccount(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

		const { id } = req.params;

		const { firstName, lastName, email, avatar, phoneNumber, address, region } = req.body;

		try {
			let newAvatar = '';
			if (avatar.startsWith('data:')) {
				const response = await cloudinary.uploader.upload(avatar, {
					folder: 'itgo/avatar',
					resource_type: 'image',
				});
				newAvatar = response.public_id;
			}

			await User.findByIdAndUpdate(id, {
				firstName,
				lastName,
				email,
				avatar: avatar.startsWith('data:') ? newAvatar : avatar,
				phoneNumber,
				address,
				region,
			});
			return res.json({ msg: 'Account was updated successfully' });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [POST] /api/users/change-password
	async changePassword(req, res) {
		const { _id } = req.user;
		const { oldPassword, newPassword, confirmNewPassword } = req.body;

		try {
			const user = await User.findById(_id);
			// Compare hased password with user password to see if they are valid
			const isMatch = await bcrypt.compareSync(oldPassword, user.password);
			if (!isMatch) return res.status(401).json({ errors: [{ msg: 'Old password is invalid' }] });
			if (newPassword !== confirmNewPassword)
				return res.status(400).json({ errors: [{ msg: 'Confirm password not match' }] });

			// Hash password before saving to database
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(newPassword, salt);

			await User.findByIdAndUpdate(_id, { password: hashedPassword });
			return res.json({ msg: 'Password was updated successfully' });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [GET] /api/instructors
	async getAllInstructors(req, res) {
		let _page = parseInt(req.query._page);
		let _limit = parseInt(req.query._limit);

		const query = { isInstructor: true };

		// get instructor base on _page and _limit per _page
		if (_page) {
			_page = _page >= 0 ? _page : 1;
			_limit = _limit || 1;
			_limit = _limit >= 0 ? _limit : 1;
			const skipDocs = (_page - 1) * _limit;

			try {
				const _totalRows = await User.find(query).count();
				const instructors = await User.find(query)
					.sort({ createdAt: -1 })
					.limit(_limit)
					.skip(skipDocs)
					.select('firstName lastName avatar position');

				const pagination = { _page, _limit, _totalRows };

				return res.json({ instructors, pagination });
			} catch (error) {
				console.log(error);
				return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
			}
		}

		// get all instructors
		try {
			const instructors = await User.find(query)
				.sort({ createdAt: -1 })
				.select('firstName lastName avatar position email');
			return res.json({ instructors });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},

	async banUser(req, res) {},
};

module.exports = UserController;
