const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Category = require("../models/Category");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const { connectDB, disconnectDB } = require("../config/connection");
const createAllIndexes = require("../indexes/createIndexes");

/**
 * Seed Database — Populate initial data
 * Run: node db/seeds/seed.js
 */

const seedDatabase = async () => {
  try {
    console.log("\n🌱 Starting Database Seed...\n");

    // Connect to MongoDB
    await connectDB();

    // Drop existing collections (optional - comment out if you want to preserve data)
    console.log("🗑️  Clearing existing collections...");
    await User.collection.deleteMany({});
    await Category.collection.deleteMany({});
    await Product.collection.deleteMany({});
    await Cart.collection.deleteMany({});
    console.log("✓ Collections cleared\n");

    // Create indexes
    await createAllIndexes();

    // 1. Create Admin User
    console.log("👤 Creating Admin User...");
    const adminHash = await bcrypt.hash("Admin@1234", 12);
    const admin = await User.create({
      name: "Admin",
      email: "admin@example.com",
      passwordHash: adminHash,
      role: "admin",
    });
    console.log(`✓ Admin created: ${admin.email}\n`);

    // 2. Create Customer User
    console.log("👤 Creating Customer User...");
    const customerHash = await bcrypt.hash("Customer@1234", 12);
    const customer = await User.create({
      name: "John Doe",
      email: "john@example.com",
      passwordHash: customerHash,
      role: "customer",
    });
    console.log(`✓ Customer created: ${customer.email}\n`);

    // 3. Create Categories
    console.log("📂 Creating Categories...");
    const categories = await Category.insertMany([
      {
        name: "Electronics",
        description: "Phones, laptops, gadgets",
        imageUrl: "/images/electronics.jpg",
      },
      {
        name: "Clothing",
        description: "Men and women fashion",
        imageUrl: "/images/clothing.jpg",
      },
      {
        name: "Home & Living",
        description: "Furniture and décor",
        imageUrl: "/images/home.jpg",
      },
      {
        name: "Sports",
        description: "Gear and equipment",
        imageUrl: "/images/sports.jpg",
      },
    ]);
    const [electronicsId, clothingId, homeId, sportsId] = categories.map(
      (c) => c._id
    );
    console.log(`✓ ${categories.length} categories created\n`);

    // 4. Create Products (10+)
    console.log("🛍️  Creating Products...");
    const products = await Product.insertMany([
      {
        name: "iPhone 15",
        slug: "iphone-15",
        description: "Apple iPhone 15 128GB with advanced camera system",
        price: 999,
        stock: 50,
        images: ["/img/iphone15.jpg"],
        categoryId: electronicsId,
      },
      {
        name: "Samsung Galaxy S24",
        slug: "samsung-s24",
        description: "Samsung Galaxy S24 with 256GB storage",
        price: 849,
        stock: 40,
        images: ["/img/s24.jpg"],
        categoryId: electronicsId,
      },
      {
        name: "MacBook Pro 14",
        slug: "macbook-pro-14",
        description: "Apple MacBook Pro 14-inch with M3 Pro Chip",
        price: 1999,
        stock: 20,
        images: ["/img/macbook.jpg"],
        categoryId: electronicsId,
      },
      {
        name: "AirPods Pro",
        slug: "airpods-pro",
        description: "Apple AirPods Pro with active noise cancellation",
        price: 249,
        stock: 100,
        images: ["/img/airpods.jpg"],
        categoryId: electronicsId,
      },
      {
        name: "Men's Hoodie",
        slug: "mens-hoodie",
        description: "Comfortable cotton blend hoodie for everyday wear",
        price: 49,
        stock: 200,
        images: ["/img/hoodie.jpg"],
        categoryId: clothingId,
      },
      {
        name: "Running Shoes",
        slug: "running-shoes",
        description: "Lightweight and comfortable running trainers",
        price: 129,
        stock: 80,
        images: ["/img/shoes.jpg"],
        categoryId: sportsId,
      },
      {
        name: "Coffee Table",
        slug: "coffee-table",
        description: "Solid oak coffee table with minimal design",
        price: 299,
        stock: 15,
        images: ["/img/table.jpg"],
        categoryId: homeId,
      },
      {
        name: "Yoga Mat",
        slug: "yoga-mat",
        description: "Non-slip yoga mat, 6mm thick, perfect for workouts",
        price: 39,
        stock: 150,
        images: ["/img/yogamat.jpg"],
        categoryId: sportsId,
      },
      {
        name: "Desk Lamp",
        slug: "desk-lamp",
        description: "LED desk lamp with adjustable arm and brightness control",
        price: 59,
        stock: 60,
        images: ["/img/lamp.jpg"],
        categoryId: homeId,
      },
      {
        name: "Women's Dress",
        slug: "womens-dress",
        description: "Floral summer dress perfect for casual occasions",
        price: 79,
        stock: 90,
        images: ["/img/dress.jpg"],
        categoryId: clothingId,
      },
      {
        name: "Wireless Keyboard",
        slug: "wireless-keyboard",
        description: "Slim wireless keyboard with long battery life",
        price: 69,
        stock: 70,
        images: ["/img/keyboard.jpg"],
        categoryId: electronicsId,
      },
      {
        name: "Office Chair",
        slug: "office-chair",
        description: "Ergonomic office chair with lumbar support",
        price: 199,
        stock: 25,
        images: ["/img/chair.jpg"],
        categoryId: homeId,
      },
    ]);
    console.log(`✓ ${products.length} products created\n`);

    // 5. Create Cart for Customer
    console.log("🛒 Creating Customer Cart...");
    const cart = await Cart.create({
      userId: customer._id,
      items: [],
      totalPrice: 0,
    });
    console.log("✓ Empty cart created for customer\n");

    // Summary
    console.log("═══════════════════════════════════════════════════════════");
    console.log("✅ DATABASE SEEDED SUCCESSFULLY!");
    console.log("═══════════════════════════════════════════════════════════");
    console.log("\n📊 Seed Summary:");
    console.log(`   • Users: 2 (1 admin, 1 customer)`);
    console.log(`   • Categories: ${categories.length}`);
    console.log(`   • Products: ${products.length}`);
    console.log(`   • Carts: 1`);
    console.log(`   • Collections: 7`);
    console.log("\n🔐 Test Credentials:");
    console.log(`   Admin:    admin@example.com / Admin@1234`);
    console.log(`   Customer: john@example.com / Customer@1234`);
    console.log("\n═══════════════════════════════════════════════════════════\n");

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error(`\n❌ Seed Error: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
};

// Run seed
seedDatabase();
