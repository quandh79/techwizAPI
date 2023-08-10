const express = require("express");
//const router = express.Router();
const router = express.Router();
const streamingProvider = require("./../controllers/streamingProviderController");

router.get("/get", streamingProvider.getStreamingProviders);
router.get("/get-by-name", streamingProvider.getStreamingProviderByName);
router.get("/get-service/:name", streamingProvider.getService);

module.exports = router;