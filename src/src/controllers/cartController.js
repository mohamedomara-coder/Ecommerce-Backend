const cartService = require("../services/cartService");

function getCart(req, res, next) {
  try {
    const cart = cartService.getCart(req.user.id);
    res.json(cart);
  } catch (error) {
    next(error);
  }
}

function addItem(req, res, next) {
  try {
    const cart = cartService.addItem(req.user.id, req.body);
    res.json(cart);
  } catch (error) {
    next(error);
  }
}

function updateItem(req, res, next) {
  try {
    const cart = cartService.updateItemQuantity(req.user.id, req.body.productId, req.body.quantity);
    res.json(cart);
  } catch (error) {
    next(error);
  }
}

function removeItem(req, res, next) {
  try {
    const cart = cartService.removeItem(req.user.id, req.body.productId);
    res.json(cart);
  } catch (error) {
    next(error);
  }
}

module.exports = { getCart, addItem, updateItem, removeItem };
