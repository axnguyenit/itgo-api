const mongoose = require('mongoose');
const { handleDataBeforeResponse } = require('../../utils/model');
const { Schema } = mongoose;

const Payment = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    provider: {
      type: String,
      required: true,
      trim: true,
    },
    transId: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

Payment.method('toJSON', handleDataBeforeResponse);

module.exports = mongoose.model('Payment', Payment);
