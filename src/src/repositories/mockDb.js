const { createId } = require("../utils/id");

const db = {
  users: [],
  products: [],
  carts: [],
  orders: [],
  passwordResetTokens: [],
  payments: [],
};

function seed() {
  if (db.products.length > 0) return;

  db.products.push(
    {
      id: createId("prd"),
      name: "Wireless Headphones",
      price: 129.99,
      image: "https://example.com/headphones.jpg",
      description: "Noise-cancelling over-ear headphones",
      category: "electronics",
      stock: 50,
      ratings: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: createId("prd"),
      name: "Running Shoes",
      price: 89.0,
      image: "https://example.com/shoes.jpg",
      description: "Lightweight running shoes for daily training",
      category: "fashion",
      stock: 100,
      ratings: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  );
}

seed();

module.exports = db;
