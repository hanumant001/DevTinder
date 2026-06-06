const express = require("express");

const app = express();
const { adminAuth } = require("./middlewares/auth");
app.use("/admin", adminAuth);

app.get("/admin/data", (req, res) => {
  res.send("Admin Data sent");
});

app.get("/admin/delete", (req, res) => {
  res.send("Data deleted");
});

app.get(
  "/main",
  (req, res, next) => {
    console.log("1st route handler");

    res.send("1st result");
    next();
  },
  (req, res) => {
    console.log("second route handler");
    res.send("2nd result");
  },
);
app.listen(1111, () => {
  console.log("server listning on the port 0001");
});
