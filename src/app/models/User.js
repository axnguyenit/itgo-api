var mongoose = require('mongoose');

const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

const User = new Schema(
	{
		// id: ObjectId,
		firstName: { type: String, required: true, trim: true },
		lastName: { type: String, required: true, trim: true },
		email: { type: String, required: true, unique: true, lowercase: true },
		password: {
			type: String,
			required: true,
		},
		isAdmin: { type: Boolean, required: true, default: false },
		refreshToken: { type: String },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('User', User);
