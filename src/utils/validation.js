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
module.exports={validateSignupData}