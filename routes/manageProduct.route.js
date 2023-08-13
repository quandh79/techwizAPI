const express = require("express");
const ProductController = require("../controllers/ProductController");
const router = express.Router();

router.post("/create/", ProductController.createProduct);
router.delete("/getproductprovider/:id", ProductController.getProductProviders);

module.exports = router;
