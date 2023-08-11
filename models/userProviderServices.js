const mongoose = require("mongoose");
const validator = require("validator");
const {Schema} = require("mongoose");

const UserProviderServices = new mongoose.Schema({
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
      SubscriptionDate: {
        type: Date,
        required: [true, "Please fill your Subscription Date"],
      },
      RenewalDate: {
        type: Date,
        required: [true, "Please fill your Subscription Renewal Date"],
      },
      isActive: {
        type: Boolean,
        default: false
      },
      streamingProviderId: {type: Schema.ObjectId, ref: "streamingProvider", required: true},
      userId: {type: Schema.ObjectId, ref: "User", required: true},

})
module.exports = mongoose.model("UserProviderServices",UserProviderServices);