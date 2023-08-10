const mongoose = require("mongoose");

const UserProviderServices = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please fill your name"],
  },
  price: {
    type: Number,
    required: [true, "Please fill your price"],
  },

  description: {
    type: String,
    required: [true, "Please fill your description"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  SubscriptionDate: {
    type: Date,
    required: [true, "Please fill your Subscription Date"],
  },
  RenewalDate: {
    type: Date,
    required: [true, "Please fill your Subscription Renewal Date"],
  },
  streamingProvider: {
    type: Schema.Types.ObjectId,
    ref: "streamingProvider",
    required: true,
  },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});
module.exports = mongoose.model("UserProviderServices", UserProviderServices);
