const productService = require("../services/productService");

function listProducts(req, res, next) {
  try {
    const products = productService.listProducts(req.query);
    res.json(products);
  } catch (error) {
    next(error);
  }
}

function createProduct(req, res, next) {
  try {
    const product = productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

function getProductById(req, res, next) {
  try {
    const product = productService.getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    next(error);
  }
}

function rateProduct(req, res, next) {
  try {
    const product = productService.rateProduct(req.params.id, req.user.id, req.body.rating);
    res.json(product);
  } catch (error) {
    next(error);
  }
}

function updateProduct(req, res, next) {
  try {
    const product = productService.updateProduct(req.params.id || req.params.productId, req.body);
    res.json(product);
  } catch (error) {
    next(error);
  }
}

function deleteProduct(req, res, next) {
  try {
    productService.deleteProduct(req.params.id || req.params.productId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = { listProducts, getProductById, rateProduct, createProduct, updateProduct, deleteProduct };
