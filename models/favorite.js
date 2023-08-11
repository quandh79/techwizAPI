const { mongoose, Schema } = require("mongoose");

const favoritesSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: "Users" },
  productId: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  
});
module.exports = mongoose.model("Favorites", favoritesSchema);