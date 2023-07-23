const express = require("express");
const {
  addMessage,
  getAllMessages,
} = require("../controllers/messagesController");
const router = express.Router();

router.post("/addMessage", addMessage);
router.post("/getMessages", getAllMessages);

module.exports = router;
