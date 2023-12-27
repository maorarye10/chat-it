const mongoose = require("mongoose");

const friendRequestSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ["pending", "declined", "accepted"],
      default: "pending",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reciver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FriendRequest", friendRequestSchema);
