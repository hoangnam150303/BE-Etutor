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
        name: { type: String }, 
        url: { type: String },
        createDate: { type: Date },
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
      },
    ],
    videos: [
      {
        name: { type: String }, 
        url: { type: String },
        createDate: { type: Date },
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
      },
    ],
    isAccepted: { type: Boolean, default: false },
    isStart: { type: Boolean, default: false },
    isFinish: { type: Boolean, default: false },
    startDate: { type: Date },
    finishdate: { type: Date },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Class", ClassSchema);
