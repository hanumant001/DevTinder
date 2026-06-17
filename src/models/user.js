const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Entered Email is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        const regex = /[^a-zA-Z0-9\s]/g;
        if (!regex.test(value)) {
          throw new Error(
            "The password must have atleast one special Character",
          );
        }
      },
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
    },
    photo: {
      type: String,
      default:
        "https://png.pngtree.com/png-clipart/20230930/original/pngtree-man-avatar-isolated-png-image_13022170.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("invalid Photo URL");
        }
      },
    },
    skill: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign({ _id: user }, "DevTinder@123", {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.bcrypt = async function (enteredPassword) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(
    enteredPassword,
    user?.password,
  );
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
