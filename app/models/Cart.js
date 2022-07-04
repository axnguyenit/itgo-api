const mongoose = require('mongoose');
const { handleDataBeforeResponse } = require('../../utils/model');
const { Schema } = mongoose;

const Cart = new Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

Cart.method('toJSON', handleDataBeforeResponse);

module.exports = mongoose.model('Cart', Cart);
