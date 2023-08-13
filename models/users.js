const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please fill your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, " Please provide a valid email"],
  },
    
    password:{
        type:String,
        required: true,
        minLength:6,
        maxLength:255,
        
    },
   token:{type:String},
      isActive: {
        type: Boolean,
        default: true
      },
      
      deviceToken:{type:String}
});




module.exports = mongoose.model("User",userSchema);
