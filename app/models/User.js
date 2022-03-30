const mongoose = require('mongoose');
const { Schema } = mongoose;

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
			trim: true,
		},
		avatar: {
			type: String,
			trim: true,
			default: '',
		},
		position: {
			type: String,
			trim: true,
			default: '',
		},
		phoneNumber: {
			type: String,
			trim: true,
			default: '',
		},
		address: {
			type: String,
			trim: true,
			default: '',
		},
		region: {
			type: String,
			trim: true,
			default: '',
		},
		password: {
			type: String,
			required: true,
			trim: true,
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
		isApply: {
			type: Boolean,
			required: true,
			default: false,
		},
		isBanned: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('User', User);
