const mongoose = require('mongoose');
const { handleDataBeforeResponse } = require('../../utils/model');
const { Schema } = mongoose;

const CartItem = new Schema(
  {
    cartId: {
      type: String,
      required: true,
      trim: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
  },
  {
    timestamps: true,
  }
);

CartItem.method('toJSON', handleDataBeforeResponse);

module.exports = mongoose.model('CartItem', CartItem);
