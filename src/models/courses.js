const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    tutors: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    classes: {type: Number},
    students: {type: Number}, 
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", schema);
