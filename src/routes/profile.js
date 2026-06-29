const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const { validateEditProfileData } = require("../utils/validator");

const profileRouter = express.Router();
// const { userAuth } = require("./middlewares/auth");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    // const { token } = req.cookies;
    // if (!token) {
    //   throw new Error("Token is not valid");
    // }
    // const decodedMessage = await jwt.verify(token, "DevTinder@123");
    // const { _id } = decodedMessage;
    // const findTheUser = await User.findById(_id);
    // if (!findTheUser) {
    //   throw new Error("User Not Found");
    // }
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("something went wrong while in Profile Data");
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateEditProfileData(req);
    const _id = req?.user?._id;
    const user = await User.findByIdAndUpdate(_id, req.body, {
      runValidators: true,
    });
    res.send("user update successful");
  } catch (error) {
    res.status(400).send(error.message);
  }
});
module.exports = profileRouter;
