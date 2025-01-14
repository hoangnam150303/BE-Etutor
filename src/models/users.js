const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    phoneNumber: { type: String },
    role: {
      type: String,
      enum: ["Admin", "Student", "Tutor"],
    },
    status: {
      type: Boolean,
    },
    googleId: {
      type: String,
    },
    appleId: {
      type: String,
    },
    lastLogin: { type: Date },
    authProvider: { type: String, required: true },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", schema);
