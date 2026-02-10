import mongoose from "mongoose";
import { name } from "nodeman/lib/mustache";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2
  },

  lastName: {
    type: String,
    required: true,
    minlength: 2,
    enum: ["POp","hip hop" , "romantic"]
  },

  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
  },

  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },

  dateOfBirth: {
    type: Date,
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  },

  // Embedded address object
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  }
});

const User = mongoose.model("User", userSchema);

export default User;
