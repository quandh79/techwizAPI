const mongoose = require("mongoose");
const validator = require("validator");
const {Schema} = require("mongoose")

const userProfile = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please fill your name"],
  },
  birthday: Date,
  address: {
    type: String,
    trim: true,
  },
  city: {
    type: String,

  },
  country: {
    type: String,
 
  },
  
  
  userId: {type: Schema.Types.ObjectId, ref: "User", required: true},


});




module.exports =  mongoose.model("UserProfile", userProfile);
