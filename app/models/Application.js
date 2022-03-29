const mongoose = require('mongoose');
const { Schema } = mongoose;

const Application = new Schema(
	{
		user: {
			type: String,
			trim: true,
			required: true,
		},
		position: {
			type: String,
			trim: true,
			required: true,
		},
		cv: {
			type: String,
			trim: true,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Application', Application);
