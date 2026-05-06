const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * PasswordResetToken Model — One-time password reset tokens with TTL
 */

const passwordResetTokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
});

// Indexes
passwordResetTokenSchema.index({ token: 1 }, { unique: true });
// TTL index — auto-delete documents after expiresAt
passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("PasswordResetToken", passwordResetTokenSchema);
