const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderItem = new Schema(
	{
		orderId: {
			type: String,
			required: true,
			trim: true,
		},
		userId: {
			type: String,
			required: true,
			trim: true,
		},
		course: {
			type: Schema.Types.ObjectId,
			ref: 'Course',
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('OrderItem', OrderItem);
