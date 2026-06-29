const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignupData } = require("../utils/validator");
const { userAuth } = require("../middlewares/auth");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;

  try {
    validateSignupData(req);
    const passwordHash = await bcrypt.hash(password, 10);
    const addedNewUser = await new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await addedNewUser.save();
    res.send("successfully added New User");
  } catch (err) {
    res.send("something went wrong while adding new user");
  }
});

// login API////
authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("invalid credentials");
    }
    const isPasswordValid = await user.getBcryptMethodSchema(password);
    if (isPasswordValid) {
      const token = await user.getJWTFromSchemaMethod();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 5 * 3600000),
      });
      res.send("Login Successful");
    } else {
      throw new Error("invalid credentials");
    }
  } catch (err) {
    res.status(400).send("error while logging in" + err);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("logout successful!!")
});

module.exports = authRouter;
