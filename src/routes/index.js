const routes = (app) => {
    app.use('/', (req, res) => {
        res.send('Hello!!!');
    });
}

module.exports = routes;