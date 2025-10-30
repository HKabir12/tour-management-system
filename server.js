import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }, // Allow all origins for development
});

io.on("connection", (socket) => {
  console.log("New socket connected:", socket.id);

  // Join a room (tour group)
  socket.on("joinRoom", ({ username, room }) => {
    socket.join(room);
    io.to(room).emit("roomNotice", `${username} joined the room`);
  });

  // Chat message
  socket.on("chatMessage", ({ message, room }) => {
    io.to(room).emit("chatMessage", message);
  });

  // Typing indicator
  socket.on("typing", ({ username, room }) => {
    io.to(room).emit("typing", username);
  });

  socket.on("stopTyping", ({ username, room }) => {
    io.to(room).emit("stopTyping", username);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Socket.io server running on http://localhost:${PORT}`);
});
