const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const userRoutes = require("./routes/userRoutes");

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);

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
