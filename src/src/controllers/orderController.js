const orderService = require("../services/orderService");

function checkout(req, res, next) {
  try {
    const order = orderService.checkout(req.user.id, req.body);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
}

function getMyOrders(req, res, next) {
  try {
    const orders = orderService.getUserOrders(req.user.id);
    res.json(orders);
  } catch (error) {
    next(error);
  }
}

function getOrderById(req, res, next) {
  try {
    const order = orderService.getOrderById(req.params.id, req.user);
    res.json(order);
  } catch (error) {
    next(error);
  }
}

function getAllOrders(req, res, next) {
  try {
    const orders = orderService.getAllOrders();
    res.json(orders);
  } catch (error) {
    next(error);
  }
}

module.exports = { checkout, getMyOrders, getOrderById, getAllOrders };
