const mongoose = require('mongoose');
const { handleDataBeforeResponse } = require('../../utils/model');
const { Schema } = mongoose;

const CourseDetail = new Schema(
  {
    overview: {
      type: String,
      required: true,
      trim: true,
    },
    requirements: {
      type: String,
      required: true,
      trim: true,
    },
    targetAudiences: {
      type: String,
      required: true,
      trim: true,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
  },
  {
    timestamps: true,
  }
);

CourseDetail.method('toJSON', handleDataBeforeResponse);

module.exports = mongoose.model('CourseDetail', CourseDetail);
