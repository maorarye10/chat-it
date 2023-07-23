const messageModel = require("../models/messageModel");

module.exports.addMessage = async (req, res, next) => {
  try {
    const { sender, reciver, messageText } = req.body;
    const message = await messageModel.create({
      sender: sender,
      users: [sender, reciver],
      text: messageText,
    });
    if (message) {
      return res.status(200).send(message);
    }
    return res.status(500).send({
      message:
        "An error occured while trying adding the comment to the database.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllMessages = async (req, res, next) => {
  try {
    const { user, contact } = req.body;
    const messages = await messageModel
      .find({
        users: {
          $all: [user, contact],
        },
      })
      .sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => ({
      fromSelf: msg.sender.toString() === user,
      message: msg.text,
    }));

    res.status(200).send(projectedMessages);
  } catch (error) {
    next(ex);
  }
};
