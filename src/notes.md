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

app.use("/home", (req,res)=>{
res.send("Hi From Home Page")
})
app.use("/profile", (req,res)=>{
res.send("Hi From Home profile page")
})
