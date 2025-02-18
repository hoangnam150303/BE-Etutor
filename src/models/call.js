const mongoose = require("mongoose");

const callSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    isSuccess: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Call", callSchema);
