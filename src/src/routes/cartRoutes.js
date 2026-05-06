const express = require("express");
const cartController = require("../controllers/cartController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth);
router.get("/", cartController.getCart);
router.post("/add", cartController.addItem);
router.patch("/update", cartController.updateItem);
router.post("/remove", cartController.removeItem);

module.exports = router;
