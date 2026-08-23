import mongoose from "mongoose";
const userSchema = new mongoose.schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Name!"],
    },
    email: {
      type: String,
      required: [true, "Please Enter Email!"],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "Please Enter phone!"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please Enter password!"],
    },
    age: {
      type: String,
      required: [true, "Please Enter Age!"],
    },
    gender: {
      type: String,
      enum: ["MALE ", "FEMALE"],
      required: [true, "Please Enter Gender!"],
    },
    address: {
      type: String,
    },
    userType: {
      type: String,
      enum: ["USER ", "DOCTOR", "PATHOLOGOIST", "ADMIN"],
      default: "USER",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamp: true,
  },
);


const User = mongoose.model('USER' , userSchema)
export default User