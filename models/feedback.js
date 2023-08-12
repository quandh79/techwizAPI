const { default: mongoose, Schema } = require("mongoose");

const feedbackShema = new mongoose.Schema({
  userID: { type: Schema.Types.ObjectId, ref: "User" },
  providerID: { type: Schema.Types.ObjectId, ref: "Provider" },
  feedback: { type: String },
  isActive: { type: Boolean, default: false },
});
module.exports = mongoose.model("Feedback", feedbackShema);
