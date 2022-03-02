const mongoose = require('mongoose');
const { Schema } = mongoose;

const Review = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		comment: {
			type: String,
			required: true,
		},
		rating: {
			type: Number,
			required: true,
			min: 1,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Review', Review);
