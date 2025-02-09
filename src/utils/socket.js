const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});
function getReceiverSocketId(userId) {
  console.log(userId);

  return userSocketMap[userId];
}
const userSocketMap = {};
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Emit the updated list of connected users
  io.emit("user-connected", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    if (userId) {
      delete userSocketMap[userId]; // Remove the user from the map on disconnect
    }
    io.emit("user-disconnected", Object.keys(userSocketMap)); // Emit updated list
  });
});

module.exports = { io, server, app, getReceiverSocketId };
