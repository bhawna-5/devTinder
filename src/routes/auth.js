const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { validateSignupData } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
  validateSignupData(req);
  const { firstName, lastName, emailId, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    firstName,
    lastName,
    emailId,
    password: passwordHash,
  });
  await user.save();
  res.send("successfully created");
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      //console.log(token);

      res.cookie("token", token);
      res.send("login successfull!!!!");
    } else {
      throw new Error("invalid credentials");
    }
  } catch (err) {
    res.status(404).send("ERROR is:" + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("logout successfully");
});
module.exports = authRouter;
