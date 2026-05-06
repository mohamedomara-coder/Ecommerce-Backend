const app = require("./app");
const env = require("./config/env");
const mongoose = require("mongoose");
const { createUser, findUserByEmail } = require("./models/userModel");
const bcrypt = require("bcryptjs");
const db = require("./repositories/mockDb");
const Product = require("../../E Commerce DB/E Commerce/db/models/Product");
const User = require("../../E Commerce DB/E Commerce/db/models/User");
require("dotenv").config({ path: require("path").resolve(__dirname, "../../src/.env") });

async function ensureDefaultAdmin() {
  if (findUserByEmail("admin@shop.local")) return;
  const passwordHash = await bcrypt.hash("Admin123!", 10);
  createUser({
    name: "System Admin",
    email: "admin@shop.local",
    passwordHash,
    role: "admin",
  });
}

async function connectDB() {
  if (!process.env.MONGODB_URI) {
    console.log("No MONGODB_URI in env, relying on mockDb for now. Please configure.");
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    
    // Sync MongoDB to mockDb for in-memory operations to remain untouched
    const products = await Product.find({});
    if (products.length > 0) {
      db.products.length = 0; // clear mockdb
      products.forEach(p => {
        db.products.push({
          id: p.slug, // mapping slug to id correctly without modifying core flow
          name: p.name,
          price: p.price,
          description: p.description,
          image: "https://example.com/item.jpg", // placeholder
          category: "electronics", 
          stock: p.stock,
          ratings: p.ratings || [],
          createdAt: p.createdAt,
          updatedAt: p.updatedAt
        });
      });
    }

    const users = await User.find({});
    if (users.length > 0) {
      db.users.length = 0;
      users.forEach(u => {
        db.users.push({
          id: u.id || u._id.toString(),
          name: u.name,
          email: u.email,
          passwordHash: u.password,
          role: u.role,
          createdAt: u.createdAt,
          updatedAt: u.updatedAt
        });
      });
    }
  } catch (error) {
    console.error(`✗ MongoDB Connection Error: ${error.message}`);
  }
}

async function bootstrap() {

  await connectDB(); 
  await ensureDefaultAdmin();
  app.listen(process.env.PORT || env.port, () => {
    // eslint-disable-next-line no-console

    console.log(`API is running on http://localhost:${env.port}`);
  });
}

bootstrap();

