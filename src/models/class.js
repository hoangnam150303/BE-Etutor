const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    documents: [
      {
        url: { type: String },
        createDate: { type: Date },
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
      },
    ],
    videos: [
      {
        url: { type: String },
        createDate: { type: Date },
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
      },
    ],
    isStart: { type: Boolean, default: false },
    isFinish: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Class", ClassSchema);
