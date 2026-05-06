/**
 * Database Initialization File
 * Use this to initialize the entire database from scratch
 * Usage: node db/init.js
 */

const mongoose = require("mongoose");
const { connectDB, disconnectDB } = require("./config/connection");
const createAllIndexes = require("./indexes/createIndexes");

/**
 * Initialize Database
 * - Connects to MongoDB
 * - Creates all indexes
 * - (Optional) Seeds initial data
 */

const initDatabase = async (shouldSeed = false) => {
  try {
    console.log("\n═══════════════════════════════════════════════════════════");
    console.log("🔧 DATABASE INITIALIZATION");
    console.log("═══════════════════════════════════════════════════════════\n");

    // Step 1: Connect
    console.log("Step 1️⃣  Connecting to MongoDB...");
    await connectDB();
    console.log("✓ Connected!\n");

    // Step 2: Create Indexes
    console.log("Step 2️⃣  Creating Indexes...");
    await createAllIndexes();
    console.log("✓ Indexes created!\n");

    // Step 3: Optional Seeding
    if (shouldSeed) {
      console.log("Step 3️⃣  Seeding Database...");
      const seedDatabase = require("./seeds/seed");
      // Note: seed.js handles its own connection, so we skip it here
      console.log("ℹ️  To seed, run: node db/seeds/seed.js\n");
    }

    console.log("═══════════════════════════════════════════════════════════");
    console.log("✅ DATABASE INITIALIZATION COMPLETE!");
    console.log("═══════════════════════════════════════════════════════════\n");

    console.log("📊 Collections Ready:");
    console.log("   • users");
    console.log("   • categories");
    console.log("   • products");
    console.log("   • carts");
    console.log("   • orders");
    console.log("   • ratings");
    console.log("   • passwordResetTokens\n");

    console.log("📝 Next Steps:");
    console.log("   1. Seed data: npm run seed");
    console.log("   2. Start your backend application");
    console.log("   3. Use models from db/models\n");

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error(`\n❌ Initialization Error: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
};

// Run initialization
const args = process.argv.slice(2);
const shouldSeed = args.includes("--seed");
initDatabase(shouldSeed);
