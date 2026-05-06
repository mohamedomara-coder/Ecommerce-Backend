/**
 * Mongoose Models Index
 * Import all models from this single file
 */

const User = require("./User");
const Category = require("./Category");
const Product = require("./Product");
const Cart = require("./Cart");
const Order = require("./Order");
const Rating = require("./Rating");
const PasswordResetToken = require("./PasswordResetToken");

module.exports = {
  User,
  Category,
  Product,
  Cart,
  Order,
  Rating,
  PasswordResetToken,
};
