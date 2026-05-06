/**
 * Database Utilities & Helpers
 * Common database operations
 */

const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");
const Cart = require("./models/Cart");
const Rating = require("./models/Rating");

/**
 * Create a new user
 */
const createUser = async (userData) => {
  const { name, email, passwordHash, role = "customer" } = userData;

  const user = await User.create({
    name,
    email,
    passwordHash,
    role,
  });

  return user;
};

/**
 * Get user by email
 */
const getUserByEmail = async (email) => {
  return await User.findOne({ email }).select("+passwordHash");
};

/**
 * Get all admins
 */
const getAllAdmins = async () => {
  return await User.find({ role: "admin" }).select("name email");
};

/**
 * Get all customers
 */
const getAllCustomers = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const customers = await User.find({ role: "customer" })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await User.countDocuments({ role: "customer" });

  return {
    customers,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  };
};

/**
 * Delete user and related data
 */
const deleteUser = async (userId) => {
  // Delete user
  await User.findByIdAndDelete(userId);

  // Delete cart
  await Cart.deleteMany({ userId });

  // Delete orders (keep for history, set userId to null if you prefer)
  // await Order.deleteMany({ userId });

  // Delete ratings
  await Rating.deleteMany({ userId });
};

/**
 * Get product pagination
 */
const getProductsPaginated = async (page = 1, limit = 20, filter = {}) => {
  const skip = (page - 1) * limit;

  const products = await Product.find(filter)
    .skip(skip)
    .limit(limit)
    .populate("categoryId", "name")
    .lean();

  const total = await Product.countDocuments(filter);

  return {
    products,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get order details with populated references
 */
const getOrderDetails = async (orderId) => {
  return await Order.findById(orderId)
    .populate("userId", "name email phone")
    .lean();
};

/**
 * Get orders pagination
 */
const getOrdersPaginated = async (page = 1, limit = 20, filter = {}) => {
  const skip = (page - 1) * limit;

  const orders = await Order.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate("userId", "name email")
    .lean();

  const total = await Order.countDocuments(filter);

  return {
    orders,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get pending orders (for fulfillment)
 */
const getPendingOrders = async () => {
  return await Order.find({
    status: { $in: ["pending_payment", "processing"] },
  })
    .sort({ createdAt: 1 })
    .populate("userId", "name email phone");
};

/**
 * Check inventory
 */
const checkInventory = async (productId, quantity) => {
  const product = await Product.findById(productId).select("stock name");
  if (!product) throw new Error("Product not found");
  if (product.stock < quantity) throw new Error("Insufficient inventory");
  return true;
};

/**
 * Decrement product stock
 */
const decrementStock = async (productId, quantity) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    { $inc: { stock: -quantity } },
    { new: true }
  );

  if (product.stock < 0) {
    // Restore if goes negative
    await Product.findByIdAndUpdate(productId, { $inc: { stock: quantity } });
    throw new Error("Insufficient stock");
  }

  return product;
};

/**
 * Restock product
 */
const restockProduct = async (productId, quantity, reason = "") => {
  return await Product.findByIdAndUpdate(
    productId,
    { $inc: { stock: quantity } },
    { new: true }
  );
};

/**
 * Export database stats
 */
const getDatabaseStats = async () => {
  const stats = {
    users: await User.countDocuments(),
    admins: await User.countDocuments({ role: "admin" }),
    customers: await User.countDocuments({ role: "customer" }),
    categories: await require("./models/Category").countDocuments(),
    products: await Product.countDocuments(),
    carts: await Cart.countDocuments(),
    orders: await Order.countDocuments(),
    ratings: await Rating.countDocuments(),
    collections: 7,
  };

  return stats;
};

/**
 * Clear all test data (be careful!)
 */
const clearAllData = async () => {
  console.warn("⚠️  Clearing all collections...");

  await User.deleteMany({});
  await require("./models/Category").deleteMany({});
  await Product.deleteMany({});
  await Cart.deleteMany({});
  await Order.deleteMany({});
  await Rating.deleteMany({});
  await require("./models/PasswordResetToken").deleteMany({});

  console.log("✓ All collections cleared");
};

module.exports = {
  createUser,
  getUserByEmail,
  getAllAdmins,
  getAllCustomers,
  deleteUser,
  getProductsPaginated,
  getOrderDetails,
  getOrdersPaginated,
  getPendingOrders,
  checkInventory,
  decrementStock,
  restockProduct,
  getDatabaseStats,
  clearAllData,
};
