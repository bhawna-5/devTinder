const jwt = require("jsonwebtoken");
const User = require("../models/user");
const express = require("express");
const app = express();
app.use(express.json());
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("Invalid token");
    const decodedMsg = await jwt.verify(token, "randomtoken");
    const { _id } = decodedMsg;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user does not exist");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
};
module.exports = { userAuth };
