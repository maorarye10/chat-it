const { request } = require("express");
const friendRequestModel = require("../models/friendRequestModel");
const { addContactToUser } = require("./usersController");

module.exports.getRequestsBySender = async (req, res, next) => {
  try {
    const sender = req.params.senderId;

    if (!sender) {
      return res.status(422).send({ message: "senderId param not found" });
    }

    const requests = await friendRequestModel.find({
      sender,
      status: "pending",
    });

    res.status(200).send({ requests });
  } catch (error) {
    res.status(500).send({
      message:
        "An error occured while trying to get the friend requests. (api/friendRequests/bySender)",
    });
  }
};

module.exports.getRequestsByReciver = async (req, res, next) => {
  try {
    const reciver = req.params.reciverId;

    if (!reciver) {
      return res.status(422).send({ message: "reciverId param not found" });
    }

    const requests = await friendRequestModel
      .find({
        reciver,
        status: "pending",
      })
      .populate("sender");

    requests.forEach((request) => {
      request.sender.password = undefined;
      request.sender.contacts = undefined;
    });

    res.status(200).send({ requests });
  } catch (error) {
    res.status(500).send({
      message:
        "An error occured while trying to get the friend requests. (api/friendRequests/byReciver)",
    });
  }
};

module.exports.createRequest = async (req, res, next) => {
  try {
    const { sender, reciver } = req.body;

    if (!sender || !reciver) {
      return res
        .status(422)
        .send({ message: "sender or reciver params not found" });
    }

    const request = await friendRequestModel.findOne({
      $or: [
        {
          sender,
          reciver,
        },
        {
          sender: reciver,
          reciver: sender,
        },
      ],
      status: "pending",
    });

    if (request) {
      return res.status(409).send({ message: "Request already exists" });
    }

    const newRequest = await friendRequestModel.create({
      status: "pending",
      sender,
      reciver,
    });

    res.status(200).send({ request: newRequest });
    return;
  } catch (error) {
    res.status(500).send({
      message:
        "An error occured while trying to add the friend request to the database. (api/friendRequests/create)",
    });
  }
};

module.exports.declineRequest = async (req, res, next) => {
  const { reqId } = req.params;
  const response = await updateRequest(reqId, false, res);
  res.status(response.statusCode).send({ request: response.data });
};

module.exports.AcceptRequest = async (req, res, next) => {
  const { reqId } = req.params;
  const response = await updateRequest(reqId, true, res);

  const request = response.data;
  if (request) {
    const sender = await addContactToUser(request.sender, request.reciver);
    const reciver = await addContactToUser(request.reciver, request.sender);
    request.sender = sender;
    request.reciver = reciver;
  }
  res.status(response.statusCode).send({ request });
};

const updateRequest = async (reqId, isAccepted) => {
  const response = {
    statusCode: 200,
    data: {},
  };
  try {
    if (!reqId) {
      response.statusCode = 422;
      response.data = { message: "reqId param not found" };
      return response;
    }
    const newStatus = isAccepted ? "accepted" : "declined";
    const request = await friendRequestModel.findOneAndUpdate(
      { _id: reqId, status: "pending" },
      { status: newStatus },
      { new: true }
    );
    response.data = request;
  } catch (error) {
    response.statusCode = 500;
    response.data = {
      message:
        "An error occured while trying to change the request status. (api/friendRequests/update)",
    };
  }
  return response;
};
