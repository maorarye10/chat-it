const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const messagesRoutes = require("./routes/messagesRoutes");
const friendRequestsRoutes = require("./routes/friendRequestsRoutes");
const socket = require("socket.io");

dotenv.config();
const clientUrl = process.env.CLIENT_URL;
const mongoUrl = process.env.MONGO_URL;
const port = process.env.PORT;

const app = express();

app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/friendRequests", friendRequestsRoutes);

app.get("/", (req, res) => {
  res.send("CHAT-IT Backend by Maor Arie");
});

const server = http.createServer(app);

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successful!");
    server.listen(port, () => {
      console.log(`Server started on port ${port}!`);
    });
  })
  .catch((err) => {
    console.log(`ERROR: ${err.message}`);
  });

const io = socket(server, {
  cors: {
    origin: clientUrl,
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-message", (senderId, reciverId, message) => {
    const targetSocket = onlineUsers.get(reciverId);
    if (targetSocket) {
      socket.to(targetSocket).emit("message-recieved", senderId, message);
    }
  });
});
