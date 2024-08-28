import mongoose, { Schema } from "mongoose";

const User = mongoose.model('User', new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    ref: "Role",
  },
  faculty: {
    type: String,
    ref: "Faculty",
  },
  agreement: {
    type: Boolean,
    default: false,
  },
}))

export default User;
