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

      // const isToAndFromUserIdSame = fromUserId.toString() === toUserId.toString();
      // console.log("isToAndFromUserIdSame", isToAndFromUserIdSame);
      // if (isToAndFromUserIdSame) {
      //   res.status(404).json({ message: "fromUser and toUser cant be same" });
      // }
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

module.exports = requestRouter;
