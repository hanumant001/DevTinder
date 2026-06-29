const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter Strong password");
  }
};

const validateEditProfileData = (req) => {
  const data = req?.body;
  
  // try { 
    const allowedKeys = ["about", "age", "gender", "photo", "skill"];
    const notAllowedKeys = [];
    const isDataKeysAllowed = Object.keys(data).every((k) => {
      if (!allowedKeys.includes(k)) {
        notAllowedKeys.push(k);
        return false;
      } else {
        return true;
      }
    });
    if (!isDataKeysAllowed) {
      throw new Error(`Updates are not allowed ${notAllowedKeys}`);
    }
  //   if (data.skill.length > 10) {
  //     throw new Error("Skill cant not be more than 10");
  //   }
  // // } catch (error) {
  // //   console.error(error.message);
  // // }
};
module.exports = { validateSignupData, validateEditProfileData };
