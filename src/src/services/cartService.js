const HttpError = require("../utils/httpError");
const { getOrCreateCart } = require("../models/cartModel");
const { findById } = require("../models/productModel");

function enrichCart(cart) {
  const items = cart.items.map((item) => ({
    ...item,
    subtotal: Number((item.unitPrice * item.quantity).toFixed(2)),
  }));
  const total = Number(items.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2));
  return { userId: cart.userId, items, total };
}

function getCart(userId) {
  return enrichCart(getOrCreateCart(userId));
}

function addItem(userId, { productId, quantity = 1 }) {
  const product = findById(productId);
  if (!product) throw new HttpError(404, "Product not found");

  const cart = getOrCreateCart(userId);
  const qty = Number(quantity);
  if (!qty || qty < 1) throw new HttpError(400, "quantity must be >= 1");

  const existing = cart.items.find((item) => item.productId === productId);
  if (existing) existing.quantity += qty;
  else cart.items.push({ productId, name: product.name, unitPrice: product.price, quantity: qty });
  cart.updatedAt = new Date().toISOString();

  return enrichCart(cart);
}

function updateItemQuantity(userId, productId, quantity) {
  const cart = getOrCreateCart(userId);
  const item = cart.items.find((i) => i.productId === productId);
  if (!item) throw new HttpError(404, "Item not in cart");

  const qty = Number(quantity);
  if (!qty || qty < 1) throw new HttpError(400, "quantity must be >= 1");

  item.quantity = qty;
  cart.updatedAt = new Date().toISOString();
  return enrichCart(cart);
}

function removeItem(userId, productId) {
  const cart = getOrCreateCart(userId);
  cart.items = cart.items.filter((i) => i.productId !== productId);
  cart.updatedAt = new Date().toISOString();
  return enrichCart(cart);
}

module.exports = { getCart, addItem, updateItemQuantity, removeItem };
