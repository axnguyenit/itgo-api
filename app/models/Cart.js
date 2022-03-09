const mongoose = require('mongoose');
const { Schema } = mongoose;

const Cart = new Schema(
	{
		userId: {
			type: String,
			required: true,
			trim: true,
		},
		// total: {
		// 	type: Number,
		// 	required: true,
		// 	min: 0,
		// },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Cart', Cart);
