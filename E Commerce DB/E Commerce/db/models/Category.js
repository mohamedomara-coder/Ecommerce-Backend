const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Category Model — Product classification
 */

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: String,
    imageUrl: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Indexes
categorySchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model("Category", categorySchema);
