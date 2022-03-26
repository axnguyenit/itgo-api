const mongoose = require('mongoose');
const { Schema } = mongoose;

const Technology = new Schema(
	{
		name: {
			type: String,
			trim: true,
			required: true,
		},
		image: {
			type: String,
			trim: true,
			required: true,
		},
		tag: {
			type: String,
			trim: true,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Technology', Technology);
