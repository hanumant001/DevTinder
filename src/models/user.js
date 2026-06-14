const mongoose = require("mongoose");

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
      default: "",
    },
    skill: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);
module.exports = User;
