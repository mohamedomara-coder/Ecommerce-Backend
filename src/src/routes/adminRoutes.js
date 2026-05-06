const express = require("express");
const adminController = require("../controllers/adminController");
const productController = require("../controllers/productController");
const orderController = require("../controllers/orderController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(requireAuth, requireRole("admin"));

router.post("/products", productController.createProduct);
router.get("/products/:id", productController.getProductById);
router.patch("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);
router.get("/orders", orderController.getAllOrders);
router.get("/orders/:id", orderController.getOrderById);
router.get("/stats", adminController.getStats);

module.exports = router;
