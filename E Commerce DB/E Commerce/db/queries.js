/**
 * Advanced Database Queries
 * Complex operations for specific use cases
 */

const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");
const Cart = require("./models/Cart");
const Rating = require("./models/Rating");

/**
 * 1. Get user with all related data
 */
const getUserWithAllData = async (userId) => {
  return await User.findById(userId)
    .select("-passwordHash -resetPasswordToken")
    .lean();
};

/**
 * 2. Search products by text (full-text search)
 */
const searchProducts = async (searchTerm, limit = 10) => {
  return await Product.find(
    { $text: { $search: searchTerm } },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .limit(limit)
    .lean();
};

/**
 * 3. Get products by price range
 */
const getProductsByPriceRange = async (minPrice, maxPrice, limit = 20) => {
  return await Product.find({
    price: { $gte: minPrice, $lte: maxPrice },
  })
    .populate("categoryId", "name")
    .limit(limit)
    .lean();
};

/**
 * 4. Get best-rated products
 */
const getTopRatedProducts = async (limit = 10, minReviews = 1) => {
  return await Product.find({
    numReviews: { $gte: minReviews },
  })
    .sort({ averageRating: -1 })
    .limit(limit)
    .populate("categoryId", "name")
    .lean();
};

/**
 * 5. Get customer's order history
 */
const getCustomerOrderHistory = async (userId, limit = 10) => {
  return await Order.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("_id totalAmount status createdAt deliveredAt paidAt")
    .lean();
};

/**
 * 6. Get customer's reviews
 */
const getCustomerReviews = async (userId) => {
  return await Rating.find({ userId })
    .populate("productId", "name slug images")
    .sort({ createdAt: -1 })
    .lean();
};

/**
 * 7. Get products in a specific category with pagination
 */
const getProductsByCategory = async (categoryId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const products = await Product.find({ categoryId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Product.countDocuments({ categoryId });

  return {
    products,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * 8. Get low stock products (for admin alerts)
 */
const getLowStockProducts = async (threshold = 20) => {
  return await Product.find({ stock: { $lte: threshold } })
    .sort({ stock: 1 })
    .select("name stock price")
    .lean();
};

/**
 * 9. Get related products (same category)
 */
const getRelatedProducts = async (productId, limit = 4) => {
  const product = await Product.findById(productId).select("categoryId");

  if (!product || !product.categoryId) return [];

  return await Product.find({
    categoryId: product.categoryId,
    _id: { $ne: productId },
  })
    .limit(limit)
    .lean();
};

/**
 * 10. Add item to cart
 */
const addToCart = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");
  if (product.stock < quantity) throw new Error("Insufficient stock");

  const cart = await Cart.findOneAndUpdate(
    { userId },
    {
      $push: {
        items: {
          productId,
          quantity,
          priceAtAdd: product.price,
        },
      },
    },
    { new: true }
  );

  // Recalculate total
  let totalPrice = 0;
  for (let item of cart.items) {
    totalPrice += item.quantity * item.priceAtAdd;
  }
  await Cart.findByIdAndUpdate(cart._id, { totalPrice });

  return cart;
};

/**
 * 11. Remove item from cart
 */
const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOneAndUpdate(
    { userId },
    {
      $pull: { items: { productId } },
    },
    { new: true }
  );

  // Recalculate total
  let totalPrice = 0;
  for (let item of cart.items) {
    totalPrice += item.quantity * item.priceAtAdd;
  }
  await Cart.findByIdAndUpdate(cart._id, { totalPrice });

  return cart;
};

/**
 * 12. Update cart item quantity
 */
const updateCartItemQuantity = async (userId, productId, newQuantity) => {
  if (newQuantity < 1) throw new Error("Quantity must be at least 1");

  const cart = await Cart.findOneAndUpdate(
    { userId, "items.productId": productId },
    {
      $set: { "items.$.quantity": newQuantity },
    },
    { new: true }
  );

  // Recalculate total
  let totalPrice = 0;
  for (let item of cart.items) {
    totalPrice += item.quantity * item.priceAtAdd;
  }
  await Cart.findByIdAndUpdate(cart._id, { totalPrice });

  return cart;
};

/**
 * 13. Get cart with product details
 */
const getCartWithDetails = async (userId) => {
  return await Cart.findOne({ userId }).populate("items.productId");
};

/**
 * 14. Create order from cart
 */
const createOrderFromCart = async (userId, shippingAddress, paymentMethod = "stripe") => {
  const cart = await Cart.findOne({ userId });
  if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

  // Create order with snapshots
  const order = await Order.create({
    userId,
    items: cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.priceAtAdd,
      // Note: name should be fetched from product, but using snapshot pattern
    })),
    shippingAddress,
    paymentMethod,
    totalAmount: cart.totalPrice,
    status: "pending_payment",
  });

  // Clear cart
  await Cart.findByIdAndUpdate(cart._id, {
    items: [],
    totalPrice: 0,
  });

  return order;
};

/**
 * 15. Update order status (with validation)
 */
const updateOrderStatus = async (orderId, newStatus) => {
  const validStatuses = ["pending_payment", "processing", "delivered", "cancelled"];
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
  }

  const updateData = { status: newStatus };

  // Set paidAt if transitioning to processing
  if (newStatus === "processing") {
    updateData.paidAt = new Date();
  }

  // Set deliveredAt if transitioning to delivered
  if (newStatus === "delivered") {
    updateData.deliveredAt = new Date();
  }

  return await Order.findByIdAndUpdate(orderId, updateData, { new: true });
};

/**
 * 16. Add or update product review
 */
const addOrUpdateReview = async (productId, userId, rating, comment) => {
  if (rating < 1 || rating > 5) throw new Error("Rating must be between 1 and 5");

  const review = await Rating.findOneAndUpdate(
    { productId, userId },
    {
      rating,
      comment,
      $set: { createdAt: new Date() }, // Reset timestamp on update
    },
    { upsert: true, new: true }
  );

  return review;
};

/**
 * 17. Get product reviews with user details
 */
const getProductReviewsWithUsers = async (productId, limit = 10) => {
  return await Rating.find({ productId })
    .populate("userId", "name email")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

/**
 * 18. Get featured products (high-rated + in stock)
 */
const getFeaturedProducts = async (limit = 8) => {
  return await Product.find({
    stock: { $gt: 0 },
    numReviews: { $gte: 2 },
  })
    .sort({ averageRating: -1, numReviews: -1 })
    .limit(limit)
    .populate("categoryId", "name")
    .lean();
};

/**
 * 19. Check if product exists by slug
 */
const getProductBySlug = async (slug) => {
  return await Product.findOne({ slug }).populate("categoryId").lean();
};

/**
 * 20. Bulk update product stock
 */
const updateProductStock = async (productId, quantity) => {
  return await Product.findByIdAndUpdate(
    productId,
    { $inc: { stock: quantity } },
    { new: true }
  );
};

module.exports = {
  getUserWithAllData,
  searchProducts,
  getProductsByPriceRange,
  getTopRatedProducts,
  getCustomerOrderHistory,
  getCustomerReviews,
  getProductsByCategory,
  getLowStockProducts,
  getRelatedProducts,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  getCartWithDetails,
  createOrderFromCart,
  updateOrderStatus,
  addOrUpdateReview,
  getProductReviewsWithUsers,
  getFeaturedProducts,
  getProductBySlug,
  updateProductStock,
};
