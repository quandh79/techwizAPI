const mongoose = require("mongoose");
const { Schema } = require("mongoose");

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
    default: false,
  },
  SubscriptionDate: {
    type: Date,
    required: [true, "Please fill your Subscription Date"],
  },
  RenewalDate: {
    type: Date,
    required: [true, "Please fill your Subscription Renewal Date"],
  },
  streamingProviderId: {
    type: Schema.Types.ObjectId,
    ref: "streamingProvider",
    required: true,
  },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});
module.exports = mongoose.model("UserProviderServices", UserProviderServices);
