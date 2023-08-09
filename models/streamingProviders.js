const mongoose = require("mongoose");

const streamingProvider = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Please fill your name"],
    },
    description: {
        type: String,
        required: [true, "Please fill your description"],
      },
      isActive: {
        type: Boolean,
        default: true
      }

      
})
module.exports = mongoose.model("streamingProvider",streamingProvider);