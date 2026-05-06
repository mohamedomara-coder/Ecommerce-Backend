const HttpError = require("../utils/httpError");
const env = require("../config/env");
const { getOrCreateCart, clearCart } = require("../models/cartModel");
const {
  createOrder,
  listOrdersByUser,
  listAllOrders,
  findOrderById,
  updateOrder,
} = require("../models/orderModel");

function checkout(userId, shippingInfo) {
  const { name, address, phone } = shippingInfo;
  if (!name || !address || !phone) {
    throw new HttpError(400, "name, address, and phone are required");
  }

  const cart = getOrCreateCart(userId);
  if (cart.items.length === 0) throw new HttpError(400, "Cart is empty");

  const total = Number(cart.items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0).toFixed(2));
  const order = createOrder({
    userId,
    items: cart.items,
    total,
    status: "pending_payment",
    shippingInfo: { name, address, phone },
    payment: { status: "awaiting_payment", provider: "stripe" },
  });

  clearCart(userId);
  return order;
}

function applyDeliveryLifecycle(order) {
  if (!order) return order;
  if (order.status === "processing" && order.delivery && order.delivery.estimatedDeliveredAt) {
    const shouldDeliver = Date.now() >= new Date(order.delivery.estimatedDeliveredAt).getTime();
    if (shouldDeliver) {
      const deliveredAt = new Date().toISOString();
      return updateOrder(order.id, {
        status: "delivered",
        delivery: { ...order.delivery, deliveredAt },
      });
    }
  }
  return order;
}

function getUserOrders(userId) {
  return listOrdersByUser(userId).map(applyDeliveryLifecycle);
}

function getAllOrders() {
  return listAllOrders().map(applyDeliveryLifecycle);
}

function getOrderById(orderId, requester) {
  const order = findOrderById(orderId);
  if (!order) throw new HttpError(404, "Order not found");
  if (requester.role !== "admin" && order.userId !== requester.id) {
    throw new HttpError(403, "Forbidden");
  }
  return applyDeliveryLifecycle(order);
}

module.exports = { checkout, getUserOrders, getAllOrders, getOrderById, applyDeliveryLifecycle };
