const express = require("express");
//const router = express.Router();
const router = express.Router();
const favorites = require("../controllers/favoriteController");
const { protect } = require("../controllers/authController");

router.post("/create", protect, favorites.create);
router.get("/getFavorite",  favorites.getFavorites);

module.exports = router;