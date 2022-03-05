const mongoose = require('mongoose');
const { Schema } = mongoose;

const Course = new Schema(
	{
		instructor: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'user',
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		cover: {
			type: String,
			required: true,
			trim: true,
		},
		// thumbnail: String,
		price: {
			type: Number,
			required: true,
			min: 0,
		},
		priceSale: {
			type: Number,
			min: 0,
			default: 0,
		},
		status: {
			type: String,
			required: true,
			trim: true,
		},
		tags: [
			{
				type: String,
				trim: true,
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
