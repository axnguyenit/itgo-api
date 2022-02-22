var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Cart = new Schema(
	{
		userId: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		totalCost: {
			type: Number,
			default: 0,
		},
		items: {
			type: Array,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Cart', Cart);
