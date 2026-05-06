const express = require("express");
const productController = require("../controllers/productController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", productController.listProducts);
router.get("/:id", productController.getProductById);
router.post("/:id/rate", requireAuth, productController.rateProduct);
router.post("/", requireAuth, requireRole("admin"), productController.createProduct);
router.put("/:productId", requireAuth, requireRole("admin"), productController.updateProduct);
router.delete("/:productId", requireAuth, requireRole("admin"), productController.deleteProduct);

module.exports = router;
