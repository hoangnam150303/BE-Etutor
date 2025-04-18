const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    message: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
