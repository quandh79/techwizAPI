const express = require("express");
const router = express.Router();
const userProfile = require("../controllers/userProfileController");
const { protect } = require("../controllers/authController");

router.post("/getUserProfile",protect, userProfile.getUserAndServices);

module.exports = router;