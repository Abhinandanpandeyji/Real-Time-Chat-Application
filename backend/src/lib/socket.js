// backend/src/lib/socket.js

import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// ✅ Fix: allow credentials and specific origin
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Used to store online users
const userSocketMap = {}; // { userId: socketId }

// Utility to get receiver socket ID
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Handle socket connection
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Send online users list to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Export app and server for backend use
export { io, app, server };
