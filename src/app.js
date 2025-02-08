const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");

const connectDb = require("./config/Database");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
//app.use("/", userRouter);
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
