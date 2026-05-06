const HttpError = require("../utils/httpError");
const productModel = require("../models/productModel");

function listProducts({ search, category, minPrice, maxPrice }) {
  let products = [...productModel.listAll()];

  if (search) {
    const keyword = search.toLowerCase();
    products = products.filter(
      (p) => p.name.toLowerCase().includes(keyword) || p.description.toLowerCase().includes(keyword),
    );
  }
  if (category) products = products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  if (minPrice) products = products.filter((p) => Number(p.price) >= Number(minPrice));
  if (maxPrice) products = products.filter((p) => Number(p.price) <= Number(maxPrice));

  return products.map((product) => {
    const ratings = Array.isArray(product.ratings) ? product.ratings : [];
    const avgRating = ratings.length
      ? Number((ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length).toFixed(2))
      : 0;
    return { ...product, avgRating, totalRatings: ratings.length };
  });
}

function createProduct(payload) {
  const required = ["name", "price", "image", "description", "category", "stock"];
  for (const field of required) {
    if (payload[field] === undefined || payload[field] === null || payload[field] === "") {
      throw new HttpError(400, `${field} is required`);
    }
  }
  return productModel.createProduct({ ...payload, price: Number(payload.price), stock: Number(payload.stock) });
}

function updateProduct(id, payload) {
  const updated = productModel.updateProduct(id, payload);
  if (!updated) throw new HttpError(404, "Product not found");
  return updated;
}

function deleteProduct(id) {
  const deleted = productModel.deleteProduct(id);
  if (!deleted) throw new HttpError(404, "Product not found");
}

function getProductById(id) {
  const product = productModel.findById(id);
  if (!product) throw new HttpError(404, "Product not found");
  const ratings = Array.isArray(product.ratings) ? product.ratings : [];
  const avgRating = ratings.length
    ? Number((ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length).toFixed(2))
    : 0;
  return { ...product, avgRating, totalRatings: ratings.length };
}

function rateProduct(productId, userId, value) {
  const rating = Number(value);
  if (!rating || rating < 1 || rating > 5) throw new HttpError(400, "rating must be between 1 and 5");
  const updated = productModel.addRating(productId, userId, rating);
  if (!updated) throw new HttpError(404, "Product not found");
  return getProductById(productId);
}

module.exports = { listProducts, createProduct, updateProduct, deleteProduct, getProductById, rateProduct };
