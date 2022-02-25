var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Order = new Schema(
	{
		userId: {
			type: String,
			required: true,
			trim: true,
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
