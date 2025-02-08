const express = require("express");
const userRouter = express.Router();

userRouter.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.emailId;
    const users = await User.find({ emailId: userEmail });
    res.send(users);
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});
userRouter.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (!users || users.length === 0) {
      return res.status(404).send("No users found");
    }
    res.send(users);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).send("Internal Server Error");
  }
});

userRouter.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  const Allowed_updates = [
    "userId",
    "photoUrl",
    "gender",
    "about",
    "age",
    "skills",
  ];
  try {
    const isUpdateAllowed = Object.keys(data).every((k) =>
      Allowed_updates.includes(k)
    );
    if (!isUpdateAllowed) throw new Error("update not allowed");
    if (data?.skills.length > 10)
      throw new Error("only maximum 10 skills are allowed");

    await User.findByIdAndUpdate(userId, data);
    res.end("successfully updated");
  } catch (err) {
    console.log("could not update");
    res.status(404).send("unsuccessful");
  }
});

userRouter.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    await User.findByIdAndDelete(userId);
    res.send("deleted successfully");
  } catch (err) {
    console.log("something went wrong");
    res.status(404).send("unsuccessful");
  }
});
