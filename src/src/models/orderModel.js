const db = require("../repositories/mockDb");
const { createId } = require("../utils/id");

function createOrder(payload) {
  const now = new Date().toISOString();
  const order = {
    id: createId("ord"),
    status: "pending",
    createdAt: now,
    updatedAt: now,
    ...payload,
  };
  db.orders.push(order);
  return order;
}

function listOrdersByUser(userId) {
  return db.orders.filter((o) => o.userId === userId);
}

function listAllOrders() {
  return db.orders;
}

function findOrderById(orderId) {
  return db.orders.find((o) => o.id === orderId) || null;
}

function updateOrder(orderId, payload) {
  const order = findOrderById(orderId);
  if (!order) return null;
  Object.assign(order, payload, { updatedAt: new Date().toISOString() });
  return order;
}

function findOrderByStripeSessionId(sessionId) {
  return db.orders.find((o) => o.payment && o.payment.stripeSessionId === sessionId) || null;
}

module.exports = {
  createOrder,
  listOrdersByUser,
  listAllOrders,
  findOrderById,
  updateOrder,
  findOrderByStripeSessionId,
};
