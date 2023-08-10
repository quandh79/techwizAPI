const mongoose = require("mongoose");
const validator = require("validator");
const {Schema} = require("mongoose")

const userProfile = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please fill your name"],
  },
  email: {
    type: String,
    required: [true, "Please fill your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, " Please provide a valid email"],
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
  userId: {type: Schema.Types.ObjectId, ref: "User", required: true},


});




module.exports =  mongoose.model("UserProfile", userProfile);
