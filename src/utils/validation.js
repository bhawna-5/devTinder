const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("name invalid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("type strong password");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("email is not correct");
  }
};
const validateEditProfileData = (req) => {
  const Allowed_updates = [
    "firstName",
    "lastName",
    "photoUrl",
    "gender",
    "emailId",
    "about",
    "age",
    "skills",
  ];
  const isUpdateAllowed = Object.keys(req.body).every((k) =>
    Allowed_updates.includes(k)
  );
  return isUpdateAllowed;
};
const validateEditPassword = (req) => {
  const Allowed_updates = ["existingPassword", "newPassword"];
  const isUpdateAllowed = Object.keys(req.body).every((k) =>
    Allowed_updates.includes(k)
  );
  return isUpdateAllowed;
};
module.exports = { validateSignupData, validateEditProfileData,validateEditPassword };
