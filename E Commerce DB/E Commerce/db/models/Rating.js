const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Product = require("./Product");

/**
 * Rating Model — Product reviews and ratings (one per user per product)
 */

const ratingSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: "Rating must be an integer",
      },
    },
    comment: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Indexes
ratingSchema.index({ productId: 1 });
ratingSchema.index({ productId: 1, userId: 1 }, { unique: true });

/**
 * Post-save hook — Update product averageRating and numReviews
 */
ratingSchema.post("save", async function () {
  try {
    const result = await this.constructor.aggregate([
      { $match: { productId: this.productId } },
      {
        $group: {
          _id: "$productId",
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    if (result.length) {
      await Product.findByIdAndUpdate(this.productId, {
        averageRating: Math.round(result[0].avg * 10) / 10,
        numReviews: result[0].count,
      });
    }
  } catch (error) {
    console.error("Error updating product rating:", error.message);
  }
});

module.exports = mongoose.model("Rating", ratingSchema);
