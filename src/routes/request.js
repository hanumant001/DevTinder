const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionsRequest");
const User = require("../models/user");
// const { userAuth } = require("./middlewares/auth");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      console.log("fromReqRouter");
      const status = req.params.status;
      const toUserId = req.params.userId;
      const fromUserId = req.user._id;
      console.log(status, toUserId, fromUserId);

      const toUserPresentInDB = await User.findById(toUserId);
      if (!toUserPresentInDB) {
        return res.status(404).json({ message: "user not found!" });
      }
      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection request already exist" });
      }
      const updateConnection = await new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      await updateConnection.save();
      // res.send("successfully saved the status");
      res.json({
        message: `${req.user.firstName} is ${status} in ${toUserPresentInDB.firstName}`,
      });
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const status = req.params.status;
      const requestId = req.params.requestId;
      const loggedInUserId = req.user._id;
      // validate the status
      const validStatus = ["accepted", "rejected"];
      if (!validStatus.includes(status)) {
        return res.status(400).json({ message: "status is not allowed!" });
      }
      console.log("status", status);
      console.log("requestId", requestId);
      console.log("loggedInUserId", loggedInUserId);
      
      const findConnectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUserId,
        status: "interested",
      });
      if (!findConnectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }
      findConnectionRequest.status = status;

      const data = await findConnectionRequest.save();
      res.json({
        message: `Connection request for ${status} saved successfully`,
      });
      // hanumant => Vidya

      // loggedInuser(Vidya) === toUserId
      // status === interested
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  },
);
module.exports = requestRouter;
