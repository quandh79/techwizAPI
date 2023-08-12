const express = require("express");
//const router = express.Router();
const router = express.Router();
const feedback = require("../controllers/feedbackController");
const { protect } = require("../controllers/authController");

router.post("/create", protect, feedback.create);
router.post("/delete", protect, feedback.delete);
router.post("/update", protect, feedback.update);
router.get("/get", favorites.get);
router.get("/getactive", favorites.getActive);
router.get("/active", favorites.Active);

module.exports = router;
