/**
 * Payment success --> Save transaction --> Add student to class
 *                                      --> Add course to user's enrolled course (order)
 *                                      --> Remove course from cart
 */

const mongoose = require('mongoose');

const { Schema } = mongoose;

const Class = new Schema(
	{
		instructor: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		students: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		course: {
			type: Schema.Types.ObjectId,
			ref: 'Course',
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Class', Class);
