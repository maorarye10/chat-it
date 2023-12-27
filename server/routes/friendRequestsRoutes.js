const express = require("express");
const {
  createRequest,
  getRequestsBySender,
  getRequestsByReciver,
  declineRequest,
  AcceptRequest,
} = require("../controllers/friendRequestsController");

const router = express.Router();

router.post("/create", createRequest);
router.get("/bySender/:senderId", getRequestsBySender);
router.get("/byReciver/:reciverId", getRequestsByReciver);
router.put("/decline/:reqId", declineRequest);
router.put("/accept/:reqId", AcceptRequest);

module.exports = router;
