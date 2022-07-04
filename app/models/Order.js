const mongoose = require('mongoose');
const { handleDataBeforeResponse } = require('../../utils/model');
const { Schema } = mongoose;

const Order = new Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Payment',
    },
  },
  {
    timestamps: true,
  }
);

Order.method('toJSON', handleDataBeforeResponse);

module.exports = mongoose.model('Order', Order);
