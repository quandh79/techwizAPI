const express = require("express");
//const router = express.Router();
const router = express.Router();
const streamingProvider = require("./../controllers/streamingProviderController");
const providerModel = require('../models/streamingProviders');
var multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/streamprovider");
  },

  filename: function (req, file, cb) {
    console.log(file);
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.originalname + "-" + Date.now() + "." + extension);
  },
});

var upload = multer({ storage: storage }).single("file");

router.get("/get", streamingProvider.getStreamingProviders);
router.get("/get-service", streamingProvider.getService);
router.get("/:providerId", streamingProvider.getStreamingProviderById);
router.post("/getById", streamingProvider.getStreamingProviderById);

router.post("/upload/:id", function (req, res) {
  const { id } = req.params;
  console.log(id);
 
  upload(req, res, async function (err) {
    if (err) {
      res.status(422).send(err);
    } else {
      const p = await providerModel.findById(id)
;
      console.log(p);
      if (!p) {
        return res.status(404).json({ message: "Not Found" });
      }
      p.thumbnail = req.file.path;
      p.save();
      res.json({
        success: true,
        message: "File uploaded!",
        file: req.file,
      });
    }
  });
});
module.exports = router;
