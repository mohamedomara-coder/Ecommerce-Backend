# Database Collections Reference

## Complete Collections Documentation

### Collection 1: `users`

**Purpose:** Store all platform users (customers and admins)

**Schema:**
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase, trimmed),
  passwordHash: String (required),
  role: String (enum: ["customer", "admin"], default: "customer"),
  resetPasswordToken: String (optional),
  resetPasswordExpires: Date (optional),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `{ email: 1 }` → unique
- `{ role: 1 }` → for role queries

**Example Documents:**
```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "John Doe",
  "email": "john@example.com",
  "passwordHash": "$2a$12$...",
  "role": "customer",
  "createdAt": ISODate("2024-01-15"),
  "updatedAt": ISODate("2024-01-15")
}
```

---

### Collection 2: `categories`

**Purpose:** Product classification

**Schema:**
```javascript
{
  _id: ObjectId,
  name: String (required, unique),
  description: String (optional),
  imageUrl: String (optional),
  createdAt: Date (auto)
}
```

**Indexes:**
- `{ name: 1 }` → unique

**Example Documents:**
```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "name": "Electronics",
  "description": "Phones, laptops, gadgets",
  "imageUrl": "/images/electronics.jpg",
  "createdAt": ISODate("2024-01-15")
}
```

---

### Collection 3: `products`

**Purpose:** Product catalog

**Schema:**
```javascript
{
  _id: ObjectId,
  name: String (required),
  slug: String (required, unique, lowercase),
  description: String (required),
  price: Number (required, min: 0.01),
  stock: Number (required, min: 0),
  images: [String] (required, min 1 item),
  categoryId: ObjectId (ref: categories, optional),
  averageRating: Number (default: 0),
  numReviews: Number (default: 0),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `{ slug: 1 }` → unique
- `{ categoryId: 1 }` → for category filtering
- `{ price: 1 }` → for price range filtering
- `{ name: "text", description: "text" }` → full-text search

**Example Documents:**
```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439013"),
  "name": "iPhone 15",
  "slug": "iphone-15",
  "description": "Apple iPhone 15 128GB",
  "price": 999,
  "stock": 50,
  "images": ["/img/iphone15.jpg"],
  "categoryId": ObjectId("507f1f77bcf86cd799439012"),
  "averageRating": 4.5,
  "numReviews": 12,
  "createdAt": ISODate("2024-01-15"),
  "updatedAt": ISODate("2024-01-15")
}
```

---

### Collection 4: `carts`

**Purpose:** Shopping carts (one per customer)

**Schema:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users, unique),
  items: [{
    productId: ObjectId (ref: products),
    quantity: Number (min: 1),
    priceAtAdd: Number
  }],
  totalPrice: Number (default: 0),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `{ userId: 1 }` → unique

**Example Documents:**
```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439014"),
  "userId": ObjectId("507f1f77bcf86cd799439011"),
  "items": [
    {
      "productId": ObjectId("507f1f77bcf86cd799439013"),
      "quantity": 2,
      "priceAtAdd": 999
    }
  ],
  "totalPrice": 1998,
  "updatedAt": ISODate("2024-01-15")
}
```

---

### Collection 5: `orders`

**Purpose:** Order history (immutable)

**Schema:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  items: [{
    productId: ObjectId,
    name: String,
    quantity: Number,
    price: Number
  }],
  shippingAddress: {
    fullName: String,
    address: String,
    phone: String
  },
  paymentMethod: String (default: "stripe"),
  paymentResult: {
    sessionId: String,
    status: String,
    amountTotal: Number,
    currency: String,
    paymentIntentId: String,
    webhookReceivedAt: Date
  },
  totalAmount: Number,
  status: String (enum: ["pending_payment", "processing", "delivered", "cancelled"]),
  paidAt: Date (optional),
  deliveredAt: Date (optional),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `{ userId: 1 }`
- `{ status: 1 }`
- `{ createdAt: -1 }`
- `{ status: 1, paidAt: 1 }` → compound for auto-transition

**Example Documents:**
```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439015"),
  "userId": ObjectId("507f1f77bcf86cd799439011"),
  "items": [
    {
      "productId": ObjectId("507f1f77bcf86cd799439013"),
      "name": "iPhone 15",
      "quantity": 1,
      "price": 999
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "address": "123 Main St, City",
    "phone": "+1234567890"
  },
  "paymentMethod": "stripe",
  "paymentResult": {
    "sessionId": "cs_test_...",
    "status": "paid",
    "amountTotal": 99900,
    "currency": "usd",
    "paymentIntentId": "pi_..."
  },
  "totalAmount": 999,
  "status": "delivered",
  "paidAt": ISODate("2024-01-15"),
  "deliveredAt": ISODate("2024-01-22"),
  "createdAt": ISODate("2024-01-15"),
  "updatedAt": ISODate("2024-01-22")
}
```

---

### Collection 6: `ratings`

**Purpose:** Product reviews (one per user per product)

**Schema:**
```javascript
{
  _id: ObjectId,
  productId: ObjectId (ref: products),
  userId: ObjectId (ref: users),
  rating: Number (required, 1-5, integer),
  comment: String (optional, max 500 chars),
  createdAt: Date (auto)
}
```

**Indexes:**
- `{ productId: 1 }`
- `{ productId: 1, userId: 1 }` → unique

**Example Documents:**
```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439016"),
  "productId": ObjectId("507f1f77bcf86cd799439013"),
  "userId": ObjectId("507f1f77bcf86cd799439011"),
  "rating": 5,
  "comment": "Great phone! Highly recommended",
  "createdAt": ISODate("2024-01-20")
}
```

**Post-Save Hook:** Automatically updates product `averageRating` and `numReviews`

---

### Collection 7: `passwordResetTokens`

**Purpose:** Password reset tokens (auto-expires)

**Schema:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  token: String (required, unique),
  expiresAt: Date (required),
  used: Boolean (default: false)
}
```

**Indexes:**
- `{ token: 1 }` → unique
- `{ expiresAt: 1 }` → TTL (expireAfterSeconds: 0)

**Example Documents:**
```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439017"),
  "userId": ObjectId("507f1f77bcf86cd799439011"),
  "token": "a1b2c3d4e5f6g7h8i9j0",
  "expiresAt": ISODate("2024-01-15T06:00:00Z"),
  "used": false
}
```

---

## Relationships Summary

| From | Field | To | Type | Behavior |
|---|---|---|---|---|
| products | categoryId | categories._id | Reference | Set null on delete |
| carts | userId | users._id | Reference | Cascade delete |
| carts.items | productId | products._id | Reference | No cascade (snapshot) |
| orders | userId | users._id | Reference | Keep (history) |
| ratings | productId | products._id | Reference | Cascade delete |
| ratings | userId | users._id | Reference | Cascade delete |
| passwordResetTokens | userId | users._id | Reference | Cascade delete |

---

## Aggregation Pipeline Examples

### Top 5 Best-Selling Products
```javascript
db.orders.aggregate([
  { $match: { status: { $in: ["processing", "delivered"] } } },
  { $unwind: "$items" },
  { $group: {
      _id: "$items.productId",
      name: { $first: "$items.name" },
      totalSold: { $sum: "$items.quantity" },
      revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
  }},
  { $sort: { totalSold: -1 } },
  { $limit: 5 }
])
```

### Monthly Revenue
```javascript
db.orders.aggregate([
  { $match: { status: { $in: ["processing", "delivered"] } } },
  { $group: {
      _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
      revenue: { $sum: "$totalAmount" },
      orders: { $sum: 1 }
  }},
  { $sort: { "_id.year": 1, "_id.month": 1 } }
])
```

---

## Key Design Decisions

✅ **Reference-Based Architecture** — All main entities (users, products, orders) use ObjectId references  
✅ **Embedded Snapshots** — Order items and cart items are embedded to preserve historical data  
✅ **TTL Indexes** — Password reset tokens auto-expire via MongoDB TTL  
✅ **Full-Text Search** — Products support text search on name and description  
✅ **Compound Indexes** — Optimized for complex queries (status + paidAt)  
✅ **Post-Save Hooks** — Automatic rating calculations when reviews are added  

---

**Ready to use!** All 7 collections with complete validation, indexes, and relationships. 🎉
