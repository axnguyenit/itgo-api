const mongoose = require('mongoose');
const { Schema } = mongoose;

const CartItem = new Schema(
	{
		cartId: {
			type: String,
			required: true,
			trim: true,
		},
		course: {
			type: Schema.Types.ObjectId,
			ref: 'Course',
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('CartItem', CartItem);
