const authRouter = require('./auth');
const cartRouter = require('./carts');
const orderRouter = require('./orders');
const uploadRouter = require('./upload');
const zoomRouter = require('./zoom');
const courseRouter = require('./courses');
const userRouter = require('./users');
const instructorRouter = require('./instructors');
const paymentRouter = require('./payment');

const routes = (app) => {
	app.use('/api/auth', authRouter);
	app.use('/api/cart', cartRouter);
	app.use('/api/orders', orderRouter);
	app.use('/api/zoom', zoomRouter);
	app.use('/api/courses', courseRouter);
	app.use('/api/users', userRouter);
	app.use('/api/upload', uploadRouter);
	app.use('/api/instructors', instructorRouter);
	app.use('/api/payment', paymentRouter);
	app.use('/', (req, res) => res.render('index'));
};

module.exports = routes;
