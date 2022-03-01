const authRouter = require('./auth');
const cartRouter = require('./carts');
const orderRouter = require('./orders');
const zoomRouter = require('./zoom');

const routes = (app) => {
	app.use('/api/auth', authRouter);
	app.use('/api/cart', cartRouter);
	app.use('/api/orders', orderRouter);
	app.use('/api/zoom', zoomRouter);
	app.use('/', (req, res) => {
		const info = {
			repoApi: 'https://github.com/khanguyen01it/itgo-api',
			repoUi: 'https://github.com/khanguyen01it/itgo-ui',
		};
		res.render('home', { info });
	});
};

module.exports = routes;
