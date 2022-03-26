const authRouter = require('./auth');
const cartRouter = require('./carts');
const orderRouter = require('./orders');
const zoomRouter = require('./zoom');
const courseRouter = require('./courses');
const userRouter = require('./users');
const instructorRouter = require('./instructors');
const paymentRouter = require('./payment');
const classRouter = require('./classes');
const eventRouter = require('./events');
const roadmapRouter = require('./roadmaps');
const technologyRouter = require('./technologies');

const routes = (app) => {
	app.use('/api/auth', authRouter);
	app.use('/api/cart', cartRouter);
	app.use('/api/orders', orderRouter);
	app.use('/api/zoom', zoomRouter);
	app.use('/api/courses', courseRouter);
	app.use('/api/users', userRouter);
	app.use('/api/instructors', instructorRouter);
	app.use('/api/payments', paymentRouter);
	app.use('/api/classes', classRouter);
	app.use('/api/events', eventRouter);
	app.use('/api/roadmaps', roadmapRouter);
	app.use('/api/technologies', technologyRouter);
	app.use('/', (req, res) => res.render('index'));
};

module.exports = routes;
