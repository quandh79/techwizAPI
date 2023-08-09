const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required: true,
        unique:true,
        minLength:6,
        maxLength:255
    },
    
    password:{
        type:String,
        required: true,
        minLength:6,
        maxLength:255,
        
    },
   
      isActive: {
        type: Boolean,
        default: true
      },
      
      passwordResetToken: String,
      passwordResetExpires: Date,
    

});




module.exports = mongoose.model("User",userSchema);
