const express = require("express");
//const router = express.Router();
const router = express.Router();
const Product= require("../controllers/ProductController");


router.post("/create", Product.createProduct);
router.post("/get", Product.getProduct);
router.get("/getProductProvider", Product.getProductProviders);




module.exports = router;
