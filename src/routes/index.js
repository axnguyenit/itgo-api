const authRouter = require('./auth');
const cartRouter = require('./carts');
const orderRouter = require('./orders');

const routes = (app) => {
	app.use('/api/auth', authRouter);
	app.use('/api/cart', cartRouter);
	app.use('/api/orders', orderRouter);
	app.use('/', (req, res) => {
		res.send('Hello!!!');
	});
};

module.exports = routes;
