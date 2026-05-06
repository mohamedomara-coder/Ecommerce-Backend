const mongoose = require("mongoose");

/**
 * MongoDB Connection Configuration
 * Connects to MongoDB using Mongoose ODM
 */

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce";

    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`✗ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB
 */
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("✓ MongoDB Disconnected");
  } catch (error) {
    console.error(`✗ MongoDB Disconnect Error: ${error.message}`);
  }
};

module.exports = { connectDB, disconnectDB };
