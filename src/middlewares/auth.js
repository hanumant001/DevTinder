const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const decodedObj = await jwt.verify(token, "DevTinder@123");
// console.log("decodedObj",decodedObj)
    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("Unauthorized request");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("User is unauthorized");
  }
};

module.exports = { userAuth };
