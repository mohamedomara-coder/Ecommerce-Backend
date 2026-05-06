const { listAllOrders } = require("../models/orderModel");
const { countUsers } = require("../models/userModel");
const { countProducts } = require("../models/productModel");

function getDashboardStats() {
  const orders = listAllOrders();
  const totalOrders = orders.length;
  const totalRevenue = Number(orders.reduce((sum, order) => sum + order.total, 0).toFixed(2));
  const totalUsers = countUsers();
  const totalProducts = countProducts();
  return { totalUsers, totalOrders, totalRevenue, totalProducts };
}

module.exports = { getDashboardStats };
