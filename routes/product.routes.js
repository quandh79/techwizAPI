const express = require("express");
const router = express.Router();
const Product = require("../controllers/ProductController");
const { protect } = require("../controllers/authController");

router.post("/create", Product.createProduct);
router.post("/getProductProvider", protect, Product.getProductProviders);
router.get("/get", protect, Product.getProduct);

module.exports = router;
