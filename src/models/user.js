const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      unique: true,
      trim: true,
      validator(value) {
        if (!validator.isEmail(value)) {
          throw new Error("email is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "",
      validator(value) {
        if (!validator.isURL(value)) {
          throw new Error("URL is not valid");
        }
      },
    },
    about: {
      type: String,
      default: "i am a user",
    },
    skills: {
      type: [String],
    },
  },
  { timstamps: true }
);

module.exports = mongoose.model("User", userSchema);
