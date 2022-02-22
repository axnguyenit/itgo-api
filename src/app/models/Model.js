var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Model = new Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		description: {
			type: String,
			default: '',
		},
		image: {
			type: String,
			default: '',
		},
		videoId: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Model', Model);
