const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

// to make req.body in readable format
app.use(express.json());

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
  const newUser = req.body;
  try {
    console.log(newUser);
    const addedNewUser = await new User(newUser);

    await addedNewUser.save();
    res.send("successfully added user");
  } catch (error) {
    res.status(400).send(error.message);
  }
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
app.patch("/user", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.body.userId, req.body, {
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
