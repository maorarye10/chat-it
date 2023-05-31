const messageModel = require("../models/messageModel");

module.exports.addMessage = async (req, res, next) => {
  try {
    const { sender, reciver, messageText } = req.body;
    const message = await messageModel.create({
      sender: sender,
      reciver: reciver,
      text: messageText,
    });
    if (data) {
      return res.status(200).send();
    }
    return res
      .status(500)
      .send({
        message:
          "An error occured while trying adding the comment to the database.",
      });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllMessages = async (req, res, next) => {};
