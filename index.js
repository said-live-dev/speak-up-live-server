const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let users = [];

io.on("connection", (socket) => {
  console.log("user connected:", socket.id);

  socket.on("join", (username) => {
    users.push({ id: socket.id, name: username });
    io.emit("users", users);
  });

  socket.on("sendMessage", (data) => {
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    users = users.filter((user) => user.id !== socket.id);
    io.emit("users", users);
    console.log("user disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("server running on port 3000");
});