const express = require("express");
//const router = express.Router();
const router = express.Router();
const Product= require("../controllers/ProductController");
const { protect } = require("../controllers/authController");


router.post("/create", Product.createProduct);
router.get("/get", Product.getProduct);
router.post("/getProductProvider", Product.getProductProviders);




module.exports = router;
