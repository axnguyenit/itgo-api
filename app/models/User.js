const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema(
	{
		firstName: {
			type: String,
			required: true,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,

			required: true,
		},
		emailVerified: {
			type: Boolean,
			required: true,
			default: false,
		},
		isAdmin: {
			type: Boolean,
			required: true,
			default: false,
		},
		isInstructor: {
			type: Boolean,
			required: true,
			default: false,
		},
		refreshToken: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('User', User);
