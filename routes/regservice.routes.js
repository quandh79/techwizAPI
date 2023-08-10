const express = require("express");
//const router = express.Router();
const router = express.Router();
const regService = require("./../controllers/RegServiceController");

router.post("/subcribe", regService.registerProviderService);

module.exports = router;
