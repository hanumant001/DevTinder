const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

// to make req.body in readable format
app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  try {
    user.save();
    res.send("user Data is saved");
  } catch (err) {
    res.status(400).send("Error saving the User");
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
