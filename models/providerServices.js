const mongoose = require("mongoose");

const ProviderService = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Please fill your name"],
    },
    price: {
        type:Number,
        required: [true, "Please fill your price"],
      },
    
    description: {
        type: String,
        required: [true, "Please fill your description"],
      },
      isActive: {
        type: Boolean,
        default: true
      },
      streamingProviderId: {type: Schema.ObjectId, ref: "User", required: true},

})
module.exports = mongoose.model("ProviderService",ProviderService);
