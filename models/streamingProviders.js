const mongoose = require("mongoose");

const streamingProvider = new mongoose.Schema({
  name: {
    type: String,
    
  },
  description: {
    type: String,
    
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  thumbnail: {
    type: String,
  },
  packages: { type: Array },
});

module.exports = mongoose.model("streamingProvider", streamingProvider);
