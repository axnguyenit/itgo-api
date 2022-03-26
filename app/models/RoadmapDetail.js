const mongoose = require('mongoose');
const { Schema } = mongoose;

const RoadmapDetail = new Schema(
	{
		roadmapId: {
			type: String,
			trim: true,
			required: true,
		},
		technology: {
			type: String,
			trim: true,
			required: true,
		},
		description: {
			type: String,
			trim: true,
			required: true,
		},
		image: {
			type: String,
			trim: true,
			required: true,
		},
		tag: {
			type: String,
			trim: true,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('RoadmapDetail', RoadmapDetail);
