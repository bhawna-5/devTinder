const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(404).send("ERROR :" + err.message);
  }
});
profileRouter.post("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData) {
      throw new Error("Invalid Edit Request");
    }
    const loggedInUser = req.user;
    console.log(loggedInUser);
    Object.keys(req.body).forEach((k) => (loggedInUser[k] = req.body[k]));
    loggedInUser.save();
    res.send(`${loggedInUser.firstName} your profile updated successfully`);
  } catch (err) {
    res.status(400).send("ERROR" + err.message);
  }
});
module.exports = profileRouter;
