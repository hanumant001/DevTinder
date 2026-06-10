create a repo
init the repo
node modules, package_json, lock_json

install express
const express = require("express");
const app = express();

listen the client with port number

app.listen(3000, ()=>{
console.log("server is Listening")
})

add URL address to send result

Note the sequence of the URL is very much important

app.use("/home", (req,res)=>{
res.send("Hi From Home Page")
})
app.use("/profile", (req,res)=>{
res.send("Hi From Home profile page")
})

git
git init
commit and push
in git website create repo
from there copy the code to merge newly created repo and local code

**how to handle dynamic routes or query params from URL to terminal**

app.get("/main", (req,res)=>{
console.log(req.query)
res.send({firstName:"Hanumant",lastName:'Hanchinamani'})
});

localhost/3000/main?userID=123

**If we didnt send the res.send?**
app.get("/main", (req,res)=>{
<!-- res.send({firstName:"Hanumant",lastName:'Hanchinamani'}) -->
});
continiusly it shows sending in Postman

**use of next()**
the next orgument will be tghe 3rd orgument of route handler which jumps to the next R H and come back
but after comeback it will throw "Cannot set headers after they are sent to the client" error because it sending response to the client we cant send res.
app.get(
  "/main",
  (req, res, next) => {
    console.log("1st route handler");
     next();
    res.send("1st result");
  },
  (req, res) => {   
    console.log("second route handler");
    res.send("2nd result");
  },
);

**Cannot get main**
this error comes when u have next() function and further u dont mention the new route handler

n  
app.get(
  "/main",
  (req, res, next) => {
    console.log("1st route handler");
     next();
  },
  (req, res,next) => {   
    console.log("second route handler");
    next() ///here it expects new R H which is not there
  },
);

**what is middleware?**
a method which can be performed in between the routes like authorization, etc

app.use("/admin", (req, res, next) => {
  const token = "xyzxd";
  const isAdminAuthorized = token === "xyz";
  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized request");
  } else {
    next();
  }
});

app.get("/admin/data", (req, res) => {
  res.send("Admin Data sent");
});

app.get("/admin/delete", (req, res) => {
  res.send("Data deleted");
});


**how to handle error?**

route handler will have first param as err (err,req,res,next)

there are 2 methods to handle errors

1> using wild card rotes which commonly handles the errors but it should in the bottom of all routes

app.get("/userData", (req, res) => {
  throw new Error("rerfe");
  res.send("userData fetched");
});
app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("something went wrong");
  }
});
above if eny where the error comes it will catched in wild card rotes 

2> using try catch method in a perticular routes


app.get("/userData", (req, res) => {
  try {
    throw new Error("rerfe");
    res.send("data sent");
  } catch (err) {
    res.status(500).send("something went wrong in fetching user Data");
  }
});


**connect to Database**
step 1 : install Mongoose
Step 2: create config folder
step 3 : require ("mongoose")
step 4 : connect with URl 

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://hanumantgh007_db_user:xA5%212BXYBNWv8Bz@dummycluster.tahh4jx.mongodb.net/devTinder",
  );
};

module.exports = connectDB

step 5 : call the above function in app.js


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

**create Schema for each collection**

create folder called models and create file for each collection and for each Schema like user

const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;

**call User in app to call Post API **

const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const user = await new User({
    firstName: "Hanumant",
    lastName: "Hanchinamani",
    emailId: "hanumant001@gmail.com",
    password: "hanumant@123",
  });
  try {
    user.save();
    res.send("user Data is saved");
  } catch (err) {
    res.status(400).send("Error saving the User");
  }
});


