const express = require("express");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
// userRouter.get("/user", async (req, res) => {
//   try {
//     const userEmail = req.body.emailId;
//     const users = await User.find({ emailId: userEmail });
//     res.send(users);
//   } catch (err) {
//     res.status(400).send("something went wrong");
//   }
// });
// userRouter.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find({});
//     if (!users || users.length === 0) {
//       return res.status(404).send("No users found");
//     }
//     res.send(users);
//   } catch (err) {
//     console.error("Error fetching users:", err.message);
//     res.status(500).send("Internal Server Error");
//   }
// });

// userRouter.patch("/user", async (req, res) => {
//   const userId = req.body.userId;
//   const data = req.body;
//   const Allowed_updates = [
//     "userId",
//     "photoUrl",
//     "gender",
//     "about",
//     "age",
//     "skills",
//   ];
//   try {
//     const isUpdateAllowed = Object.keys(data).every((k) =>
//       Allowed_updates.includes(k)
//     );
//     if (!isUpdateAllowed) throw new Error("update not allowed");
//     if (data?.skills.length > 10)
//       throw new Error("only maximum 10 skills are allowed");

//     await User.findByIdAndUpdate(userId, data);
//     res.end("successfully updated");
//   } catch (err) {
//     console.log("could not update");
//     res.status(404).send("unsuccessful");
//   }
// });

// userRouter.delete("/user", async (req, res) => {
//   try {
//     const userId = req.body.userId;
//     await User.findByIdAndDelete(userId);
//     res.send("deleted successfully");
//   } catch (err) {
//     console.log("something went wrong");
//     res.status(404).send("unsuccessful");
//   }
// });

const USER_SAFE_DATA = "firstName lastName skills about photoUrl age gender";
userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    // }).populate("fromUserId", ["firstName", "lastName"]);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    req.statusCode(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString())
        return row.toUserId;
      return row.fromUserId;
    });
    res.json({
      message: "connection fetched successfully",
      data,
    });
  } catch (err) {}
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    res.send(users);
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});
module.exports = userRouter;
