const express = require("express");
const router = express.Router();
const regService = require("../controllers/RegServiceController");
const { protect } = require("../controllers/authController");

router.post("/subcribe", protect, regService.registerProviderService);
router.post("/isactive", regService.isActive);

module.exports = router;
