var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Order = new Schema(
	{
		userId: {
			type: String,
			required: true,
			trim: true,
		},

		isPaid: {
			type: Boolean,
			required: true,
			default: false,
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

module.exports = mongoose.model('Order', Order);
