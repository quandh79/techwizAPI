const { mongoose, Schema } = require("mongoose");

const favoritesSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: "Users" },
  filmId: [{ type: Schema.Types.ObjectId, ref: "Film" }],
  channelId: [{ type: Schema.Types.ObjectId, ref: "Channel" }],
});
module.exports = mongoose.model("Favorites", favoritesSchema);