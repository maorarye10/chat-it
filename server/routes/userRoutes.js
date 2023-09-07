const express = require("express");
const {
  register,
  login,
  setAvatar,
  getUserContacts,
  getUsers,
} = require("../controllers/usersController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/setAvatar/:id", setAvatar);
router.get("/userContacts/:id", getUserContacts);
router.get("/users", getUsers);

module.exports = router;
