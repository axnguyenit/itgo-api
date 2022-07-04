const mongoose = require('mongoose');
const { handleDataBeforeResponse } = require('../../utils/model');
const { Schema } = mongoose;

const Roadmap = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    slogan: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

Roadmap.method('toJSON', handleDataBeforeResponse);

module.exports = mongoose.model('Roadmap', Roadmap);
