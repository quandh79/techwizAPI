const express = require("express");
//const router = express.Router();
const router = express.Router();
const feedback = require("../controllers/feedbackController");
const { protect } = require("../controllers/authController");

router.post("/create", protect, feedback.createFeedback);
router.post("/delete", protect, feedback.delete);
router.post("/update", protect, feedback.update);
router.get("/get", feedback.get);
router.get("/getactive", feedback.getActive);
router.get("/active", feedback.Active);

module.exports = router;
