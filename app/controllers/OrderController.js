const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');

const OrderController = {
	// [GET] /api/orders
	async index(req, res) {},

	// [GET] /api/orders/:id
	async show(req, res) {},

	// [GET] /api/orders/my-orders
	async getByUser(req, res) {
		let _page = parseInt(req.query._page);
		let _limit = parseInt(req.query._limit);
		const { _id } = req.user;
		const query = { userId: _id };

		// get orders base on _page and _limit per _page
		if (_page) {
			_page = _page >= 0 ? _page : 1;
			_limit = _limit || 1;
			_limit = _limit >= 0 ? _limit : 1;
			const skipDocs = (_page - 1) * _limit;

			try {
				const _totalRows = await OrderItem.find(query).count();
				const orders = await OrderItem.find(query)
					.limit(_limit)
					.skip(skipDocs)
					.populate({
						path: 'course',
						model: 'Course',
						select: 'name cover instructor',
						populate: {
							path: 'instructor',
							model: 'User',
							select: 'firstName lastName',
						},
					});

				const pagination = { _page, _limit, _totalRows };
				return res.json({ orders, pagination });
			} catch (error) {
				console.log(error);
				return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
			}
		}

		// ----------------------------------------------------------------------

		// get all orders
		try {
			const orders = await OrderItem.find(query).populate({
				path: 'course',
				model: 'Course',
				select: 'name cover instructor',
				populate: {
					path: 'instructor',
					model: 'User',
					select: 'firstName lastName',
				},
			});
			return res.json({ orders });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},
};

module.exports = OrderController;
