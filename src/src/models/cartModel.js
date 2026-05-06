const db = require("../repositories/mockDb");

function getOrCreateCart(userId) {
  let cart = db.carts.find((c) => c.userId === userId);
  if (!cart) {
    cart = { userId, items: [], updatedAt: new Date().toISOString() };
    db.carts.push(cart);
  }
  return cart;
}

function clearCart(userId) {
  const cart = getOrCreateCart(userId);
  cart.items = [];
  cart.updatedAt = new Date().toISOString();
  return cart;
}

module.exports = { getOrCreateCart, clearCart };
