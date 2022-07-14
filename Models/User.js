const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    PhoneNumber: { type: String, required: true },
    email: {
      type: String,
      required: [true, "Please enter your email!"],
      trim: true,
      unique: true,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png",
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Client", "Admin"],
      default: "Client",
    },
    Status: { type: Number, enum: [0, 1], default: 1 },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
