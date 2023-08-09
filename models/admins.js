const mongoose = require("mongoose");
const validator = require("validator");
const admin = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please fill your name"],
      },
    userName:{
        type:String,
        required: true,
        minLength:6,
        maxLength:255
    },
    
    password:{
        type:String,
        required: true,
        minLength:6,
        maxLength:255,
        validate: {
            validator: (v)=>{
                const passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
                return v.match(passwordFormat);
            },
            message: (t)=> `${t.value} mật khẩu có ít nhất 8 ký tự,có ký tự viết hoa,số,ký tự đặc biệt`
        }
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please fill your password confirm"],
        validate: {
          validator: function(el) {
            // "this" works only on create and save
            return el === this.password;
          },
          message: "Your password and confirmation password are not the same",
        },
      },
    
    isActive: {
      type: Boolean,
      default: true
    }
});

// encrypt the password using 'bcryptjs'
// Mongoose -> Document Middleware
admin.pre("save", async function(next) {
    // check the password if it is modified
    if (!this.isModified("password")) {
      return next();
    }
  
    // Hashing the password
    this.password = await bcrypt.hash(this.password, 12);
  
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
  });
  
  // This is Instance Method that is gonna be available on all documents in a certain collection
  admin.methods.correctPassword = async function(
    typedPassword,
    originalPassword,
  ) {
    return await bcrypt.compare(typedPassword, originalPassword);
  };
module.exports = mongoose.model("admin",admin);
