const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

let userSchema = new Schema(
  {
    email: {
      type: String,
      unique: [true, "email already exists in the database!"],
      lowercase: true,
      required: [true, "email not provided"],
    },
    password: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
