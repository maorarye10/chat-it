const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { ValidEmail, ValidPassword } = require("../util/RegexValidations");
const { request } = require("express");

const userValidation = ({ username, email, password, confirmPassword }) => {
  let status = 200;
  let message = "";
  if (password !== confirmPassword) {
    message = "The passwords are not matching";
    status = 400;
  } else if (username.length < 3) {
    message = "Username length must be at least 3 characters";
    status = 400;
  } else if (!ValidPassword.test(password)) {
    message =
      "Password Requirments:\n- At least 6 characters\n- 1 Upper case letter\n- 1 Lower case letter\n- 1 Number";
    status = 400;
  } else if (!ValidEmail.test(email)) {
    message = "Invalid email address";
    status = 400;
  }
  return {
    status: status,
    message: message,
  };
};

module.exports.addContactToUser = async (userId, contactId) => {
  const user = await userModel.findOneAndUpdate(
    { _id: userId, contacts: { $nin: [contactId] } },
    { $push: { contacts: contactId } },
    { new: true }
  );

  user.password = undefined;
  return user;
};

module.exports.removeContactFromUser = async (userId, contactId) => {
  const user = await userModel.findByIdAndUpdate(
    userId,
    { $pull: { contacts: contactId } },
    { new: true }
  );

  user.password = undefined;
  return user;
};

module.exports.register = async (req, res) => {
  //console.log(req.body);
  try {
    const result = userValidation(req.body);
    if (result.status !== 200) {
      return res.status(result.status).send({ message: result.message });
    }

    const { username, email, password } = req.body;

    const emailCheck = await userModel.findOne({ email: email });
    if (emailCheck) {
      return res.status(400).send({ message: "Email is already in use" });
    }

    const usernameCheck = await userModel.findOne({ username: username });
    if (usernameCheck) {
      return res.status(400).send({ message: "Username is already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      email: email,
      username: username,
      password: hashedPassword,
    });
    user.password = undefined;
    res.status(200).send({ user: user });
  } catch (error) {
    res.status(500).send({
      message:
        "An error occured while trying to register new user. (api/user/register)",
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userModel.findOne({ username: username });
    if (!user) {
      return res.status(404).send({ message: "Wrong username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(404).send({ message: "Wrong username or password" });
    }

    user.password = undefined;
    res.status(200).send({ user: user });
  } catch (error) {
    res.status(500).send({
      message:
        "An error occured while trying to verify the user. (api/user/login)",
    });
  }
};

module.exports.setAvatar = async (req, res) => {
  try {
    const userId = req.params.id;
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).send({ message: "You need to selecct an avatar" });
    }

    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        avatarImage: avatar,
        isAvatarImageSet: true,
      },
      { new: true }
    );

    user.password = undefined;
    res.status(200).send({ user: user });
  } catch (error) {
    res.status(500).send({
      message:
        "An error occured while trying to update the user's avatar. (api/user/setAvatar)",
    });
  }
};

module.exports.getUserContacts = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    //console.log("User's contacts:", user.contacts);
    const contacts = await userModel
      .find({
        _id: { $in: user.contacts },
      })
      .select(["email", "username", "avatarImage", "_id"]);
    //console.log("Contacts:", contacts);
    res.status(200).send({ contacts: contacts });
  } catch (error) {
    res.status(500).send({
      message:
        "An error occured while trying to update the user's avatar. (api/user/userContacts)",
    });
  }
};

/* module.exports.getUserContacts = async (req, res) => {
  try {
    const contacts = await userModel
      .find({
        _id: { $ne: req.params.id },
        isAvatarImageSet: true,
      })
      .select(["email", "username", "avatarImage", "_id"]);
    //console.log("Contacts:", contacts);
    res.status(200).send({ contacts: contacts });
  } catch (error) {
    res.status(500).send({
      message:
        "An error occured while trying to get the user's contacts. (api/user/userContacts)",
    });
  }
}; */

module.exports.getUsers = async (req, res) => {
  try {
    const { query } = req;
    const usernameQuery = query.username || ".";
    const hostUserQuery = query.hostUser || "";
    const hostUser = await userModel
      .findOne({ _id: hostUserQuery })
      .select(["_id", "contacts"]);
    const users = await userModel
      .find({
        _id: { $nin: [hostUser._id, ...hostUser.contacts] },
        username: { $regex: usernameQuery, $options: "i" },
        isAvatarImageSet: true,
      })
      .select(["email", "username", "avatarImage", "_id"]);
    //console.log("Contacts:", contacts);
    res.status(200).send({ users });
  } catch (error) {
    res.status(500).send({
      message:
        "An error occured while trying to get the users. (api/user/users)",
    });
  }
};
