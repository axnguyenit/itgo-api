const mongoose = require('mongoose');
const { handleDataBeforeResponse } = require('../../utils/model');
const { Schema } = mongoose;

const Review = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

Review.method('toJSON', handleDataBeforeResponse);

module.exports = mongoose.model('Review', Review);
