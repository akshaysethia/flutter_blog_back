const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    default: "",
    unique: true,
    required: true,
  },
  email: {
    type: String,
    default: "",
    unique: true,
    required: true,
  },
  password: {
    type: String,
    default: "",
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
