const express = require("express");
//const router = express.Router();
const router = express.Router();
const notiController = require("./../controllers/notiController");
const { protect } = require("./../controllers/authController");

router.post("/sendnotifi", protect, notiController.sendFCMNotification);
router.get("/getdevicetoken", protect, notiController.getDeviceToken);
module.exports = router;
