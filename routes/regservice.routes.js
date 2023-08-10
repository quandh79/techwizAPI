const express = require("express");
//const router = express.Router();
const router = express.Router();
const regService = require("../controllers/regServiceController");

router.post("/subcribe", regService.registerProviderService);
router.post("/isactive", regService.isActive);

module.exports = router;
