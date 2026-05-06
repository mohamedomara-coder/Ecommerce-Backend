const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Order Model — Immutable order records with embedded snapshots
 */

const orderItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const shippingAddressSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const paymentResultSchema = new Schema(
  {
    sessionId: String,
    status: String,
    amountTotal: Number,
    currency: String,
    paymentIntentId: String,
    webhookReceivedAt: Date,
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: "stripe",
    },
    paymentResult: paymentResultSchema,
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending_payment", "processing", "delivered", "cancelled"],
      default: "pending_payment",
    },
    paidAt: Date,
    deliveredAt: Date,
  },
  { timestamps: true }
);

// Indexes
orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1, paidAt: 1 });

module.exports = mongoose.model("Order", orderSchema);
