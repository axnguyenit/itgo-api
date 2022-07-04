const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');

const OrderController = {
	// [GET] /api/orders
	async index(req, res) {},

	// [GET] /api/orders/:id
	async show(req, res) {},

	// [GET] /api/orders/my-orders
	async getByUser(req, res) {
		let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    const { id: userId } = req.user;
    const query = { userId };

    // get orders base on page and limit per page
    if (page) {
      page = page >= 0 ? page : 1;
      limit = limit || 1;
      limit = limit >= 0 ? limit : 1;
      const skipDocs = (page - 1) * limit;

      try {
        const totalRows = await OrderItem.find(query).count();
        const orders = await OrderItem.find(query)
          .limit(limit)
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

        const pagination = { page, limit, totalRows };
        return res.json({ orders, pagination });
      } catch (error) {
        console.error(error.message);
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
			console.error(error.message);
			return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		}
	},
};

module.exports = OrderController;
