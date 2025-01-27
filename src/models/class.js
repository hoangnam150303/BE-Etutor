const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    documents: [
      { url: { type: String } },
      [{ comment: { type: String } }],
      { createDate: { type: Date } },
    ],
    videos: [{ url: { type: String } }, { createDate: { type: Date } }],
    isStart: { type: Boolean, default: false },
    isFinish: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Class", ClassSchema);
