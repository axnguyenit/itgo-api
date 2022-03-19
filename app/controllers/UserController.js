const { validationResult } = require('express-validator');
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
					.limit(_limit)
					.skip(skipDocs)
					.select('firstName lastName email isInstructor emailVerified avatar position isBanned');

				const pagination = { _page, _limit, _totalRows };
				return res.json({ success: true, users, pagination });
			} catch (error) {
				console.log(error);
				return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
			}
		}

		// ----------------------------------------------------------------------

		// get all users
		try {
			const users = await User.find(query).select(
				'firstName lastName email isInstructor emailVerified avatar position isBanned'
			);
			return res.json({ success: true, users });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [GET] /api/users/my-account
	async myAccount(req, res) {
		const { _id } = req.user;
		try {
			const user = await User.findById(_id).select(
				'firstName lastName email isAdmin isInstructor emailVerified avatar address phoneNumber region'
			);

			// user not found
			if (!user)
				return res.status(400).json({ success: false, errors: [{ msg: 'User do not exist' }] });

			return res.json({ success: true, user });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		}
	},

	// [PUT] /api/users/:id
	async updateAccount(req, res) {
		const errors = validationResult(req);

		if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

		const { id } = req.params;

		try {
			await User.findByIdAndUpdate(id, { ...req.body });
			return res.json({ success: true, msg: 'Account was updated successfully' });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
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
					.limit(_limit)
					.skip(skipDocs)
					.select('firstName lastName avatar position');

				const pagination = { _page, _limit, _totalRows };

				return res.json({ success: true, instructors, pagination });
			} catch (error) {
				console.log(error);
				return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
			}
		}

		// get all instructors
		try {
			const instructors = await User.find(query).select('firstName lastName avatar position');
			return res.json({ success: true, instructors });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, errors: [{ msg: 'Internal server error' }] });
		}
	},

	async banUser(req, res) {},
};

module.exports = UserController;
