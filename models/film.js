const mongoose = require("mongoose");

const FilmSchema = new mongoose.Schema({
  name: { type: String, require: true },
  description: { type: String, require: true },
  providers: { type: Array },
  category: { type: String, require: true },
});

module.exports = mongoose.model("Film", FilmSchema);
