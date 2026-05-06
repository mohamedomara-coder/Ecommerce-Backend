const Order = require("../models/Order");
const Product = require("../models/Product");

/**
 * Admin Dashboard Aggregation Queries
 * Run these queries for analytics and reporting
 */

/**
 * 1. Count total customers
 */
const getTotalCustomers = async () => {
  const User = require("../models/User");
  return await User.countDocuments({ role: "customer" });
};

/**
 * 2. Count total orders
 */
const getTotalOrders = async () => {
  return await Order.countDocuments();
};

/**
 * 3. Total revenue (paid orders only)
 */
const getTotalRevenue = async () => {
  const result = await Order.aggregate([
    {
      $match: {
        status: { $in: ["processing", "delivered"] },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  return result.length > 0 ? result[0].totalRevenue : 0;
};

/**
 * 4. Count total products
 */
const getTotalProducts = async () => {
  return await Product.countDocuments();
};

/**
 * 5. Revenue by month (last 6 months)
 */
const getRevenueByMonth = async () => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  return await Order.aggregate([
    {
      $match: {
        status: { $in: ["processing", "delivered"] },
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        revenue: { $sum: "$totalAmount" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);
};

/**
 * 6. Top 5 best-selling products
 */
const getTopProducts = async (limit = 5) => {
  return await Order.aggregate([
    {
      $match: {
        status: { $in: ["processing", "delivered"] },
      },
    },
    {
      $unwind: "$items",
    },
    {
      $group: {
        _id: "$items.productId",
        name: { $first: "$items.name" },
        totalSold: { $sum: "$items.quantity" },
        totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
      },
    },
    {
      $sort: { totalSold: -1 },
    },
    {
      $limit: limit,
    },
  ]);
};

/**
 * 7. Orders by status
 */
const getOrdersByStatus = async () => {
  return await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalAmount: { $sum: "$totalAmount" },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);
};

/**
 * 8. Customer purchase frequency
 */
const getCustomerPurchaseFrequency = async (limit = 10) => {
  const User = require("../models/User");
  return await Order.aggregate([
    {
      $group: {
        _id: "$userId",
        orderCount: { $sum: 1 },
        totalSpent: { $sum: "$totalAmount" },
        lastOrderDate: { $max: "$createdAt" },
      },
    },
    {
      $sort: { totalSpent: -1 },
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: "$userDetails",
    },
    {
      $project: {
        userId: "$_id",
        name: "$userDetails.name",
        email: "$userDetails.email",
        orderCount: 1,
        totalSpent: 1,
        lastOrderDate: 1,
      },
    },
  ]);
};

/**
 * 9. Average order value
 */
const getAverageOrderValue = async () => {
  const result = await Order.aggregate([
    {
      $match: {
        status: { $in: ["processing", "delivered"] },
      },
    },
    {
      $group: {
        _id: null,
        averageOrderValue: { $avg: "$totalAmount" },
      },
    },
  ]);

  return result.length > 0 ? result[0].averageOrderValue : 0;
};

/**
 * 10. Products by category
 */
const getProductsByCategory = async () => {
  return await Product.aggregate([
    {
      $group: {
        _id: "$categoryId",
        productCount: { $sum: 1 },
        avgPrice: { $avg: "$price" },
        totalStock: { $sum: "$stock" },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },
    {
      $unwind: "$categoryDetails",
    },
    {
      $project: {
        categoryId: "$_id",
        categoryName: "$categoryDetails.name",
        productCount: 1,
        avgPrice: { $round: ["$avgPrice", 2] },
        totalStock: 1,
      },
    },
    {
      $sort: { productCount: -1 },
    },
  ]);
};

module.exports = {
  getTotalCustomers,
  getTotalOrders,
  getTotalRevenue,
  getTotalProducts,
  getRevenueByMonth,
  getTopProducts,
  getOrdersByStatus,
  getCustomerPurchaseFrequency,
  getAverageOrderValue,
  getProductsByCategory,
};
