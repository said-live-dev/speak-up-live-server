const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();

// CORS باش يخدم مع Vercel
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Route اختبار
app.get("/", (req, res) => {
  res.send("SpeakUp Live Server is running 🚀");
});

// تخزين آخر رسالة لكل مستخدم (anti-spam)
const lastMessageTime = {};

// Socket
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("send-message", (data) => {
    const now = Date.now();

    // منع السبام (رسالة كل 1 ثانية)
    if (
      !lastMessageTime[socket.id] ||
      now - lastMessageTime[socket.id] > 1000
    ) {
      io.emit("receive-message", data);
      lastMessageTime[socket.id] = now;
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete lastMessageTime[socket.id];
  });
});

// مهم ل Render
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});