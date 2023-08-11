const mongoose = require("mongoose");

const ProductShema = new mongoose.Schema({
  name: { type: String, require: true },
  description: { type: String, require: true },
  providers: { type: Array },
  category: { type: String, require: true },
  thumbnail: {
    type: String,
  },
  thumbnail:String,
  
});

module.exports = mongoose.model("Product", ProductShema);
