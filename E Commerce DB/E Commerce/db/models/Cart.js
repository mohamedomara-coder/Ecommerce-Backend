const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Cart Model — One cart per customer with embedded items
 */

const cartItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    priceAtAdd: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

// Indexes
cartSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model("Cart", cartSchema);
