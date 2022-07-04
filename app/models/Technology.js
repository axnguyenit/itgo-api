const mongoose = require('mongoose');
const { handleDataBeforeResponse } = require('../../utils/model');
const { Schema } = mongoose;

const Technology = new Schema(
  {
    name: {
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

Technology.method('toJSON', handleDataBeforeResponse);

module.exports = mongoose.model('Technology', Technology);
