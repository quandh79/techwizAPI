const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const userProfile = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please fill your name"],
  },
  birthday: {
    type: Date,
  },
  address: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    required: [true, "Please fill your city"],
  },
  country: {
    type: String,
    required: [true, "Please fill your country"],
  },
  zipcode: {
    type: Number,
    required: [true, "Please fill your zipcode"],
  },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("UserProfile", userProfile);
