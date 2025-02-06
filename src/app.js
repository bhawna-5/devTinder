const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth");
const connectDb = require("./config/Database");
const { validateSignupData } = require("./utils/validation");
//const { default: _default } = require("validator");
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = await jwt.sign({ _id: user._id }, "randomtoken");
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(404).send("ERROR :" + err.message);
  }
});

app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.emailId;
    const users = await User.find({ emailId: userEmail });
    res.send(users);
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});
app.get("/feed", async (req, res) => {
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


app.patch("/user", async (req, res) => {
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

app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    await User.findByIdAndDelete(userId);
    res.send("deleted successfully");
  } catch (err) {
    console.log("something went wrong");
    res.status(404).send("unsuccessful");
  }
});
connectDb()
  .then(() => {
    console.log("connected to database");
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => {
    console.error("error in connecting to database");
  });
