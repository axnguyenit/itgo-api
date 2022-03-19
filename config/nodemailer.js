const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'dinhkhakl01@gmail.com',
		pass: 'uhrysobmkbklvgbl',
	},
});

const handlebarOptions = {
	viewEngine: {
		extName: '.hbs',
		partialsDir: path.resolve('./resources/views/email/'),
		defaultLayout: false,
	},
	viewPath: path.resolve('./resources/views/email/'),
	extName: '.hbs',
};

transporter.use('compile', hbs(handlebarOptions));

module.exports = transporter;
