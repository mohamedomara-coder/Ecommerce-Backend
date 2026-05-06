const db = require("../repositories/mockDb");
const { createId } = require("../utils/id");
const Product = require("../../../E Commerce DB/E Commerce/db/models/Product"); // Mongo Model

function createProduct(payload) {
  const now = new Date().toISOString();
  const product = { id: createId("prd"), ...payload, createdAt: now, updatedAt: now };
  db.products.push(product);
  // Async save to Mongo
  Product.create({ ...product, slug: product.id }).catch(err => console.error("Mongo Error:", err));
  return product;
}

function updateProduct(id, payload) {
  const product = db.products.find((p) => p.id === id);
  if (!product) return null;
  Object.assign(product, payload, { updatedAt: new Date().toISOString() });
  // Async save to Mongo
  Product.findOneAndUpdate({ slug: id }, payload, { new: true, upsert: true }).catch(err => console.error("Mongo Error:", err));
  return product;
}

function deleteProduct(id) {
  const index = db.products.findIndex((p) => p.id === id);
  if (index < 0) return false;
  db.products.splice(index, 1);
  // Async delete from Mongo
  Product.findOneAndDelete({ slug: id }).catch(err => console.error("Mongo Error:", err));
  return true;
}

function findById(id) {
  return db.products.find((p) => p.id === id) || null;
}

function listAll() {
  return db.products;
}

function addRating(id, userId, value) {
  const product = findById(id);
  if (!product) return null;
  if (!Array.isArray(product.ratings)) product.ratings = [];

  const existing = product.ratings.find((r) => r.userId === userId);
  if (existing) {
    existing.value = value;
    existing.updatedAt = new Date().toISOString();
  } else {
    product.ratings.push({ userId, value, createdAt: new Date().toISOString() });
  }
  product.updatedAt = new Date().toISOString();
  
  // Async save to Mongo
  Product.findOneAndUpdate(
    { slug: id },
    { ratings: product.ratings },
    { upsert: true }
  ).catch(err => console.error("Mongo Error:", err));

  return product;
}

function countProducts() {
  return db.products.length;
}

module.exports = { createProduct, updateProduct, deleteProduct, findById, listAll, addRating, countProducts };
