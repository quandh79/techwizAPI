const express = require("express");
//const router = express.Router();
const router = express.Router();
const channelController = require("../controllers/ChannelController");

router.post("/create", channelController.createChannel);
router.post("/get", channelController.getChannel);

module.exports = router;
