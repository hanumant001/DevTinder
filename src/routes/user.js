const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionsRequest");
const User = require("../models/user");

const userRouter = express.Router();

// gets the interested connection requests sent to the logged in user.
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const findingReqests = await ConnectionRequestModel.find({
      toUserId: loggedInUserId,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName", "photo", "skill"]);
    if (!findingReqests) {
      return res.status(404).json({ message: "request not found" });
    }
    res.json({ message: "Data sent successfully", data: findingReqests });
  } catch (err) {
    return res.status(400).send("something went wrong" + err);
  }
});

// gets the accepted connection req to the logged in user by the others. ex: loogedIn = elon , elon u have connected with Anil
userRouter.get("/user/connection", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const findAcceptedreq = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUserId, status: "accepted" },
        { toUserId: loggedInUserId, status: "accepted" },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName", "photo", "skill"])
      .populate("toUserId", ["firstName", "lastName", "photo", "skill"]);
    const result = findAcceptedreq.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUserId.toString()) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });
    if (!findAcceptedreq) {
      return res.status(404).json({ message: "request not found" });
    }
    res.json({ message: "Data sent successfully", data: result });
  } catch (err) {
    return res.status(400).send("something went wrong" + err);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const findAllColl = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    })
      .populate("fromUserId", ["firstName", "lastName", "photo", "skill"])
      .populate("toUserId", ["firstName", "lastName", "photo", "skill"]);
      
    const alreadyHavingConnection = findAllColl.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUserId.toString()) {
        return row.toUserId._id;
      } else {
        return row.fromUserId?._id.toString();
      }
    });
    console.log("alreadyHavingConnection", alreadyHavingConnection);
    const uniqueIds = [...new Set(alreadyHavingConnection)];
    uniqueIds.push(loggedInUserId.toString());

    const result = await User.find({
      _id: { $nin: uniqueIds },
    });
    console.log("result?.data", result);
    if (!alreadyHavingConnection) {
      return res.status(404).json({ message: "request not found" });
    }
    res.json({
      message: "list successfully fetched",
      data: result,
    });
  } catch (err) {
    return res.status(400).json({ message: err });
  }
});

module.exports = userRouter;
