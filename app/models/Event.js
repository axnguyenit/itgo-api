const mongoose = require('mongoose');
const { Schema } = mongoose;

const Event = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		instructor: {
			type: String,
			required: true,
		},
		course: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Course',
		},
		description: {
			type: String,
			required: true,
		},
		textColor: {
			type: String,
			required: true,
		},
		start: {
			type: Date,
			required: true,
		},
		end: {
			type: Date,
			required: true,
		},
		meetingNumber: {
			type: String,
			required: true,
		},
		passwordMeeting: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

Event.method('toJSON', function () {
	const { _id, ...event } = this.toObject();
	event.id = _id;
	return event;
});

module.exports = mongoose.model('Event', Event);
