const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

let userProfileSchema = new Schema(
  {
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    username: {
      type: String,
      trim: true,
      default: '',
    },
    firstName: {
      type: String,
      trim: true,
      default: '',
    },
    lastName: {
      type: String,
      trim: true,
      default: '',
    },
    dateOfBirth: {
      type: Date,
      validate: {
        validator: function (value) {
          return value && value < Date.now(); // Ensuring date of birth is not in the future
        },
        message: 'Date of birth must be in the past',
      },

    },
    title: {
        type: String,
        trim: true,
        default: '',
    },
    bio: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserProfile", userProfileSchema);
