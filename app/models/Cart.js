const mongoose = require('mongoose');
const { Schema } = mongoose;

const Cart = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		totalCost: {
			type: Number,
			default: 0,
			min: 0,
		},
		items: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Course',
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Cart', Cart);
