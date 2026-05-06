const mongoose = require("mongoose");
const User = require("../models/User");
const Category = require("../models/Category");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Rating = require("../models/Rating");
const PasswordResetToken = require("../models/PasswordResetToken");

/**
 * Create all indexes for database collections
 * Run this after connecting to MongoDB
 */

const createAllIndexes = async () => {
  try {
    console.log("\n📊 Creating Indexes...");

    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ role: 1 });
    console.log("  ✓ User indexes created");

    // Category indexes
    await Category.collection.createIndex({ name: 1 }, { unique: true });
    console.log("  ✓ Category indexes created");

    // Product indexes
    await Product.collection.createIndex({ slug: 1 }, { unique: true });
    await Product.collection.createIndex({ categoryId: 1 });
    await Product.collection.createIndex({ price: 1 });
    await Product.collection.createIndex({ name: "text", description: "text" });
    console.log("  ✓ Product indexes created");

    // Cart indexes
    await Cart.collection.createIndex({ userId: 1 }, { unique: true });
    console.log("  ✓ Cart indexes created");

    // Order indexes
    await Order.collection.createIndex({ userId: 1 });
    await Order.collection.createIndex({ status: 1 });
    await Order.collection.createIndex({ createdAt: -1 });
    await Order.collection.createIndex({ status: 1, paidAt: 1 });
    console.log("  ✓ Order indexes created");

    // Rating indexes
    await Rating.collection.createIndex({ productId: 1 });
    await Rating.collection.createIndex(
      { productId: 1, userId: 1 },
      { unique: true }
    );
    console.log("  ✓ Rating indexes created");

    // PasswordResetToken indexes
    await PasswordResetToken.collection.createIndex({ token: 1 }, { unique: true });
    await PasswordResetToken.collection.createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0 }
    );
    console.log("  ✓ PasswordResetToken indexes created");

    console.log("✅ All indexes created successfully!\n");
  } catch (error) {
    console.error(`❌ Error creating indexes: ${error.message}`);
    throw error;
  }
};

module.exports = createAllIndexes;
