const mongoose = require('mongoose');
const { Schema } = mongoose;

const Course = new Schema(
	{
		author: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'user',
		},
		name: {
			type: String,
			required: true,
		},
		cover: {
			type: String,
			required: true,
		},
		// thumbnail: String,
		price: {
			type: Number,
			required: true,
		},
		priceSale: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			required: true,
		},
		tags: [
			{
				type: String,
			},
		],
		details: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'CourseDetail',
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Course', Course);
