const express = require("express");
const orderController = require("../controllers/orderController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/checkout", requireAuth, orderController.checkout);
router.get("/my", requireAuth, orderController.getMyOrders);
router.get("/:id", requireAuth, orderController.getOrderById);
router.get("/", requireAuth, requireRole("admin"), orderController.getAllOrders);

module.exports = router;
