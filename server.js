const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 Speak Up Live Server Running");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let users = {};

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("join", (username) => {
    users[socket.id] = {
      id: socket.id,
      username,
    };

    io.emit("online-users", Object.values(users));
  });

  socket.on("send-message", (data) => {
    const user = users[socket.id];
    if (!user) return;

    const messageData = {
      id: socket.id,
      username: user.username,
      message: data.message,
      time: new Date().toLocaleTimeString(),
    };

    io.emit("receive-message", messageData);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
    delete users[socket.id];
    io.emit("online-users", Object.values(users));
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("🔥 Server running on port " + PORT);
});