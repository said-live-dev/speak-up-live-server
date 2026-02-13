const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const users = {}; // socketId -> username

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // تسجيل اليوزر
  socket.on("join", (username) => {
    users[socket.id] = username;
    io.emit("online-users", Object.values(users));
  });

  // استقبال الرسائل
  socket.on("send-message", (data) => {
    io.emit("receive-message", data);
  });

  // عند الخروج
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
    delete users[socket.id];
    io.emit("online-users", Object.values(users));
  });
});
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
