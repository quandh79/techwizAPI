const express = require("express");
//const router = express.Router();
const router = express.Router();
const favorites = require("../controllers/favoriteController");
const { protect } = require("../controllers/authController");

router.post("/create", protect, favorites.create);
router.get("/get", protect, favorites.get);

module.exports = router;