const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user")

app.post("/signup", async (req,res)=>{
  const user = await new User({
    firstName : "Hanumant",
    lastName :"Hanchinamani",
    emailId :"hanumant001@gmail.com",
    password :'hanumant@123'
  })
  user.save();
  res.send("user Data is saved")
})


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
