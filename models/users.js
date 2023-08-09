const mongoose = require("mongoose");
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
      }
    

});




module.exports = mongoose.model("User",userSchema);
