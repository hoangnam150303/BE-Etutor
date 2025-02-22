const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    tutors: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    classes: { type: Number },
    image: {
      type: String,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", schema);
