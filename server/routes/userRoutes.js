const express = require("express");
const {
  register,
  login,
  setAvatar,
  getUserContacts,
} = require("../controllers/usersController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/setAvatar/:id", setAvatar);
router.get("/userContacts/:id", getUserContacts);

module.exports = router;
