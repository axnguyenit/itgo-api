const authRouter = require('./auth');

const routes = (app) => {
    app.use('/auth', authRouter);
    app.use('/', (req, res) => {
        res.send('Hello!!!');
    });
}

module.exports = routes;