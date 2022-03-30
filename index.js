const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { engine } = require('express-handlebars');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const database = require('./config/database');
const routes = require('./routes');

dotenv.config();

const app = express();

// view engine setup

app.engine('hbs', engine({ extname: '.hbs' }));
app.set('views', path.join(__dirname, 'resources', 'views'));
app.set('view engine', 'hbs');

app.use(cors());

app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(logger('dev'));
// HTTP logger
// app.use(logger('combined'));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// connect database
database.connect();

// init router
routes(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
