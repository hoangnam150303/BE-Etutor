const express = require("express");
const messageRoute = express.Router();
const auth = require("../middlewares/auth");
const messageController = require("../controllers/messageController");
messageRoute.get(
  "/getAllConversation",
  auth.isAuth,
  messageController.getAllConversation
);

messageRoute.get(
  "/getMessage/:receiverId",
  auth.isAuth,
  messageController.getMessage
);
messageRoute.post(
  "/sendMessage/:receiverId",
  auth.isAuth,
  messageController.sendMessage
);

module.exports = messageRoute;