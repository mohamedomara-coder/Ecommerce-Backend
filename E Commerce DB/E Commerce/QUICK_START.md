# Database Quick Start Guide

Complete step-by-step instructions to get your MongoDB database up and running.

---

## 📦 Step 1: Install Dependencies

```bash
npm install mongoose bcryptjs dotenv
```

---

## 🔧 Step 2: Set Up Environment

Create `.env` file in project root:

```env
MONGO_URI=mongodb://localhost:27017/ecommerce
NODE_ENV=development
BCRYPT_ROUNDS=12
```

For MongoDB Atlas Cloud:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
```

---

## 🚀 Step 3: Initialize Database

Run initialization script:

```bash
node db/init.js
```

Output should show:
```
✓ Connected!
✓ Indexes created!
```

---

## 🌱 Step 4: Seed Test Data

```bash
npm run seed
```

This creates:
- ✅ 2 test users (1 admin, 1 customer)
- ✅ 4 categories
- ✅ 12 products
- ✅ 1 empty customer cart

Test credentials:
```
Admin:    admin@example.com / Admin@1234
Customer: john@example.com / Customer@1234
```

---

## 📝 Step 5: Use in Your Application

### Basic Setup (in your main server file)

```javascript
require("dotenv").config();
const { connectDB } = require("./db/config/connection");
const { User, Product, Order, Cart } = require("./db/models");

// Initialize
const app = require("express")();

app.listen(5000, async () => {
  await connectDB();
  console.log("✓ Server running on port 5000");
});
```

### Common Operations

#### Get a product
```javascript
const product = await Product.findById(productId)
  .populate("categoryId");

console.log(product);
// {
//   _id: "...",
//   name: "iPhone 15",
//   price: 999,
//   categoryId: { _id: "...", name: "Electronics" },
//   ...
// }
```

#### Search products
```javascript
const results = await Product.find(
  { $text: { $search: "phone" } },
  { score: { $meta: "textScore" } }
).sort({ score: { $meta: "textScore" } });
```

#### Get user with all data
```javascript
const user = await User.findById(userId)
  .select("-passwordHash");
```

#### Add to cart
```javascript
const updatedCart = await Cart.findOneAndUpdate(
  { userId },
  {
    $push: {
      items: {
        productId,
        quantity: 2,
        priceAtAdd: 999
      }
    }
  },
  { new: true }
).populate("items.productId");
```

#### Create order
```javascript
const order = await Order.create({
  userId,
  items: [
    {
      productId: "...",
      name: "iPhone 15",
      quantity: 1,
      price: 999
    }
  ],
  shippingAddress: {
    fullName: "John Doe",
    address: "123 Main St",
    phone: "+1234567890"
  },
  totalAmount: 999,
  status: "pending_payment"
});
```

#### Get top products
```javascript
const topProducts = await Product.find()
  .sort({ averageRating: -1, numReviews: -1 })
  .limit(8)
  .populate("categoryId");
```

#### Add review
```javascript
const review = await Rating.findOneAndUpdate(
  { productId, userId },
  { rating: 5, comment: "Great product!" },
  { upsert: true, new: true }
);
```

---

## 🎯 Advanced Operations

### Use Helper Functions

```javascript
const {
  searchProducts,
  getTopRatedProducts,
  getProductsByPriceRange,
  addToCart,
  getCartWithDetails,
  createOrderFromCart,
} = require("./db/queries");

// Search
const results = await searchProducts("laptop", 10);

// Get top products
const featured = await getTopRatedProducts(8, 2);

// Price range
const affordable = await getProductsByPriceRange(0, 500);

// Cart operations
await addToCart(userId, productId, 2);
const cart = await getCartWithDetails(userId);

// Create order from cart
const order = await createOrderFromCart(userId, shippingAddress);
```

### Admin Dashboard Queries

```javascript
const {
  getTotalCustomers,
  getTotalRevenue,
  getRevenueByMonth,
  getTopProducts,
  getOrdersByStatus,
  getProductsByCategory,
} = require("./db/aggregations");

// Dashboard metrics
const customers = await getTotalCustomers();
const revenue = await getTotalRevenue();
const monthly = await getRevenueByMonth();
const topProducts = await getTopProducts(5);
const byStatus = await getOrdersByStatus();
const byCategory = await getProductsByCategory();

console.log(`Total Customers: ${customers}`);
console.log(`Total Revenue: $${revenue}`);
console.log(`Top Products:`, topProducts);
```

### Database Utilities

```javascript
const {
  getProductsPaginated,
  getOrdersPaginated,
  checkInventory,
  decrementStock,
  getPendingOrders,
  getDatabaseStats,
} = require("./db/utils");

// Pagination
const { products, pagination } = await getProductsPaginated(1, 20, { categoryId: catId });
const { orders } = await getOrdersPaginated(1, 20);

// Inventory
await checkInventory(productId, quantity);
await decrementStock(productId, quantity);

// Admin operations
const pending = await getPendingOrders();
const stats = await getDatabaseStats();
console.log(stats);
// {
//   users: 10,
//   admins: 1,
//   customers: 9,
//   products: 100,
//   orders: 45,
//   ratings: 60,
//   ...
// }
```

---

## 📊 Database Statistics

```bash
# Connect to MongoDB shell
mongosh

# Select database
use ecommerce

# Count documents
db.users.countDocuments()
db.products.countDocuments()
db.orders.countDocuments()

# See indexes
db.products.getIndexes()

# Get database stats
db.stats()
```

---

## 🔒 Security Best Practices

### Hash passwords
```javascript
const bcrypt = require("bcryptjs");

const hashedPassword = await bcrypt.hash(plainPassword, 12);
const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
```

### Validate emails
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  throw new Error("Invalid email");
}
```

### Use lean() for read-only queries
```javascript
// Faster, plain JavaScript objects (no Mongoose overhead)
const products = await Product.find().lean();
```

### Limit sensitive fields
```javascript
// Don't return password hashes
const user = await User.findById(userId)
  .select("-passwordHash -resetPasswordToken");
```

---

## 🐛 Troubleshooting

### Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:** Start MongoDB
```bash
# Windows
mongod

# Mac/Linux
brew services start mongodb-community
```

### Duplicate Key Error
```
E11000 duplicate key error collection: ecommerce.users index: email_1
```

**Solution:** Clear duplicate data
```bash
# MongoDB shell
use ecommerce
db.users.deleteMany({ email: "duplicate@example.com" })
```

### Model Not Found
```
TypeError: require(...) is not a function
```

**Solution:** Import correctly
```javascript
// Correct
const { User, Product } = require("./db/models");

// OR
const User = require("./db/models/User");
```

---

## 📚 File Reference

| File | Purpose |
|---|---|
| `db/config/connection.js` | MongoDB connection setup |
| `db/models/User.js` | User schema & model |
| `db/models/Product.js` | Product schema & model |
| `db/models/Order.js` | Order schema & model |
| `db/models/Cart.js` | Cart schema & model |
| `db/models/Rating.js` | Rating schema & model |
| `db/models/Category.js` | Category schema & model |
| `db/models/PasswordResetToken.js` | Token schema & model |
| `db/indexes/createIndexes.js` | Index creation |
| `db/seeds/seed.js` | Database seeding |
| `db/queries.js` | 20+ advanced queries |
| `db/aggregations.js` | Admin dashboard queries |
| `db/utils.js` | Helper utilities |
| `db/init.js` | Database initialization |

---

## 🎓 Learning Resources

- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Aggregation Pipeline](https://docs.mongodb.com/manual/reference/operator/aggregation/)
- [Indexing Best Practices](https://docs.mongodb.com/manual/indexes/)

---

## ✅ Next Steps

1. ✅ Install dependencies: `npm install mongoose bcryptjs dotenv`
2. ✅ Create `.env` file with MONGO_URI
3. ✅ Run `node db/init.js` to create indexes
4. ✅ Run `npm run seed` to populate test data
5. ✅ Use models in your backend code
6. ✅ Query using helper functions from `db/queries.js`
7. ✅ Monitor admin dashboard with `db/aggregations.js`

**Your database is ready! 🎉**
