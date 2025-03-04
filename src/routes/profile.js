const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const { validateEditPassword } = require("../utils/validation");
const bcrypt = require("bcrypt");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(404).send("ERROR :" + err.message);
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }
    const loggedInUser = req.user;
    console.log(loggedInUser);
    Object.keys(req.body).forEach((k) => (loggedInUser[k] = req.body[k]));
    loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName} your profile updated successfully`,

      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR" + err.message);
  }
});
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    if (!validateEditPassword(req)) throw new Error("invalid edit request");
    const loggedInUser = req.user;
    console.log(loggedInUser);
    const { existingPassword, newPassword } = req.body;
    const isMatch = await bcrypt.compare(
      existingPassword,
      loggedInUser.password
    );
    if (!isMatch) {
      throw new Error("Existing password is incorrect");
    }
    const isSamePassword = await bcrypt.compare(
      newPassword,
      loggedInUser.password
    );
    if (isSamePassword) {
      throw new Error(
        "New password cannot be the same as the existing password"
      );
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Update the password
    loggedInUser.password = hashedPassword;
    await loggedInUser.save();

    res.send("Your password has been updated successfully.");
  } catch (err) {
    res.status(400).send("ERROR" + err.message);
  }
});
module.exports = profileRouter;
