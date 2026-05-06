# E-Commerce Database Setup Guide

## 📋 Database Structure

```
db/
├── config/
│   └── connection.js         → MongoDB connection configuration
├── models/
│   ├── index.js              → All models exported
│   ├── User.js               → User schema (admin, customer)
│   ├── Category.js           → Category schema
│   ├── Product.js            → Product schema
│   ├── Cart.js               → Cart schema (with items subdoc)
│   ├── Order.js              → Order schema (with snapshots)
│   ├── Rating.js             → Rating schema (reviews)
│   └── PasswordResetToken.js → Password reset tokens (TTL)
├── indexes/
│   └── createIndexes.js      → All index creation scripts
├── seeds/
│   └── seed.js               → Database seeding script
├── aggregations.js           → Admin dashboard queries
└── README.md                 → This file
```

## 🗄️ Collections (7 Total)

| Collection | Purpose | Records |
|---|---|---|
| `users` | All users (admin, customer) | 2 default (admin + customer) |
| `categories` | Product categories | 4 default |
| `products` | Product catalog | 12 default |
| `carts` | Shopping carts (1 per customer) | 1 per customer |
| `orders` | Order history | Grows with purchases |
| `ratings` | Product reviews | Grows with reviews |
| `passwordResetTokens` | Reset tokens (auto-expire TTL) | Temporary |

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
npm install mongoose bcryptjs dotenv
```

### 2. Environment Variables

Create a `.env` file in your project root:

```env
MONGO_URI=mongodb://localhost:27017/ecommerce
NODE_ENV=development
```

For MongoDB Atlas (cloud):
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
```

### 3. Initialize Database Connection

In your main application file (e.g., `server.js`):

```javascript
const { connectDB } = require("./db/config/connection");
const models = require("./db/models");

// Connect to MongoDB
await connectDB();

// Now use models
const { User, Product, Order } = models;
```

### 4. Create Indexes

Run this once after first connection:

```bash
node db/indexes/createIndexes.js
```

Or programmatically:

```javascript
const createAllIndexes = require("./db/indexes/createIndexes");
await createAllIndexes();
```

### 5. Seed Initial Data

Run this to populate test data:

```bash
node db/seeds/seed.js
```

**Output:**
```
✅ DATABASE SEEDED SUCCESSFULLY!

📊 Seed Summary:
   • Users: 2 (1 admin, 1 customer)
   • Categories: 4
   • Products: 12
   • Carts: 1
   • Collections: 7

🔐 Test Credentials:
   Admin:    admin@example.com / Admin@1234
   Customer: john@example.com / Customer@1234
```

## 📊 Using Models in Your Code

### Basic CRUD

```javascript
const { User, Product, Order, Cart } = require("./db/models");

// Create
const user = await User.create({
  name: "Jane Doe",
  email: "jane@example.com",
  passwordHash: "hashedPassword",
  role: "customer"
});

// Read
const product = await Product.findById(productId).populate("categoryId");

// Update
await Order.findByIdAndUpdate(orderId, { status: "delivered" });

// Delete
await User.findByIdAndDelete(userId);
```

### Populate References

```javascript
// Get order with product details
const order = await Order.findById(orderId)
  .populate("userId", "name email")
  .populate("items.productId", "name price");

// Get products with category
const products = await Product.find()
  .populate("categoryId", "name");
```

## 📈 Admin Dashboard Queries

Import aggregation queries:

```javascript
const {
  getTotalCustomers,
  getTotalRevenue,
  getTopProducts,
  getRevenueByMonth,
  getOrdersByStatus,
} = require("./db/aggregations");

// Get metrics
const customers = await getTotalCustomers();
const revenue = await getTotalRevenue();
const topProducts = await getTopProducts(5);
const monthlyRevenue = await getRevenueByMonth();
```

## 🔄 Auto-Transitions

**Order Status Auto-Update** (process.json or cron job):

Run every hour:

```javascript
const DELAY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

await Order.updateMany(
  {
    status: "processing",
    paidAt: { $lte: new Date(Date.now() - DELAY_MS) }
  },
  {
    $set: { status: "delivered", deliveredAt: new Date() }
  }
);
```

## 🔐 Indexes Summary

**Total Indexes: 15+**

| Collection | Index | Type |
|---|---|---|
| users | email | unique |
| users | role | regular |
| categories | name | unique |
| products | slug | unique |
| products | categoryId | regular |
| products | price | regular |
| products | name, description | text search |
| carts | userId | unique |
| orders | userId | regular |
| orders | status | regular |
| orders | createdAt | descending |
| orders | status, paidAt | compound |
| ratings | productId | regular |
| ratings | productId, userId | unique |
| passwordResetTokens | token | unique |
| passwordResetTokens | expiresAt | TTL |

## 🎯 Key Features

✅ **7 Collections** - Fully designed for e-commerce  
✅ **Mongoose ODM** - Schema validation & type safety  
✅ **Auto-Indexes** - All critical queries optimized  
✅ **TTL Indexes** - Automatic cleanup of expired tokens  
✅ **Aggregations** - 10 ready-to-use admin queries  
✅ **Snapshots** - Order items immutable for history  
✅ **Post-Hooks** - Automatic rating calculations  
✅ **Seed Data** - 12 products + test users included  

## 🛠️ Troubleshooting

### Connection Refused
- Ensure MongoDB is running: `mongod`
- Check MONGO_URI in `.env`

### Duplicate Key Error
- Reset collections: `db.collection.deleteMany({})`
- Drop indexes: `db.collection.dropIndexes()`

### Seed Won't Run
- Ensure bcryptjs is installed: `npm install bcryptjs`
- Check MongoDB connection

## 📚 References

- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Indexes](https://docs.mongodb.com/manual/indexes/)
- [Aggregation Pipeline](https://docs.mongodb.com/manual/reference/operator/aggregation/)

---

**Database Ready!** All 7 collections created with full indexes and validation. ✨
