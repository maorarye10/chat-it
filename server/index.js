const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const userRoutes = require("./routes/userRoutes");
const messagesRoutes = require("./routes/messagesRoutes");
const socket = require("socket.io");

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);
app.use("/api/messages", messagesRoutes);

const server = http.createServer(app);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successful!");
    server.listen(process.env.PORT, () => {
      console.log(`Server started on port ${process.env.PORT}!`);
    });
  })
  .catch((err) => {
    console.log(`ERROR: ${err.message}`);
  });

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-message", (reciverId, message) => {
    const targetSocket = onlineUsers.get(reciverId);
    if (targetSocket) {
      socket.to(targetSocket).emit("message-recieved", message);
    }
  });
});
