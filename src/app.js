const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth");
// to make req.body in readable format
app.use(express.json());
app.use(cookieParser());

// Get the User by email
app.get("/user", async (req, res) => {
  console.log(req.query.emailId);
  try {
    const users = await User.find({});
    if (users.length) {
      res.send(users);
    } else {
      res.status(404).send("User Not found");
    }
  } catch (error) {
    res.status(404).send("something went wrong");
  }
});

// user adding, Post API
app.post("/signup", async (req, res) => {
  const { firstName, lsatName, emailId, password } = req.body;
  try {
    validateSignupData(req);
    const passwordHash = await bcrypt.hash(password, 10);
    const addedNewUser = await new User({
      firstName,
      lsatName,
      emailId,
      password: passwordHash,
    });

    await addedNewUser.save();
    res.send("successfully added user");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// login API////
app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId: emailId });
    console.log(emailId);
    if (!user) {
      throw new Error("invalid credentials");
    }
    const isPasswordValid = await user.bcrypt(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      console.log("token", token);
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

///// profile API

app.get("/profile", userAuth, async (req, res) => {
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

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  res.send(`${user.firstName} has sent a connection`);
});

// delete user by _Id
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User Deleted Successfully");
  } catch (error) {
    res.status(400).send("something went wrong while deleting the User");
  }
});

// update the user Data
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req?.body;
  try {
    const allowedKeys = ["password", "age", "gender", "photo", "skill"];
    const notAllowedKeys = [];
    const isDataKeysAllowed = Object.keys(data).every((k) => {
      if (!allowedKeys.includes(k)) {
        notAllowedKeys.push(k);
        return false;
      } else {
        return true;
      }
    });
    console.log("notAllowedKeys", notAllowedKeys);
    if (!isDataKeysAllowed) {
      throw new Error(`Updates are not allowed ${notAllowedKeys}`);
    }
    if (data.skill.length > 10) {
      throw new Error("Skill cant not be more than 10");
    }
    const user = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    res.send("user update successful");
  } catch (error) {
    res.status(400).send(error.message);
  }
});
connectDB()
  .then(() => {
    console.log("Database is connected successfully");
    app.listen(1111, () => {
      console.log("server listning on the port 0001");
    });
  })
  .catch((error) => {
    console.log("problem in connecting Database");
    console.log(error.message);
  });
