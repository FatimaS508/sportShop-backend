const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
     email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },

    firstName: {
      type: String,
      required: true,
      trim: true
    },

    lastName: {
      type: String,
      required: true,
      trim: true
    },
    hashedPassword: {
      type: String,
      required: true
    },
    role:{
      type: String,
      enum: ["customer", "admin"],
      default: "customer"
    }
  },
  { timestamps: true },
);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
