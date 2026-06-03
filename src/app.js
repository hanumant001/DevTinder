const express = require("express");

const app = express();

app.use("/", (req,res)=>{
    res.send("this is main")
});
app.use("/main", (req,res)=>{
    res.send("this is Dashboard")
});

app.use("/profile",(req,res)=>{
    res.send("this Is Profile Section")
})


app.listen(1111, ()=>{
    console.log("server listning on the port 0001")
})