import mongoose from "mongoose";

const pathologistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    laboratoryName: {
      type: String,
      required: true,
      trim: true,
    },
    laboratoryAddress: {
      type: String,
      required: true,
      trim: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    experience: {
      type: Number, // years
      required: true,
      default: 0,
    },
    specialization: [
      {
      type: String,
    }
  ],
    phone: {
      type: String,
      
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    consultationFee: {
      type: Number,
      required: true,
    },
    workingHours: {
      startTime: {
        type: String, // e.g. "09:00 AM"
        required: true,
      },
      endTime: {
        type: String, // e.g. "06:00 PM"
        required: true,
      },
    },
    availableDays: {
      type: [String], // e.g. ["Monday", "Wednesday", "Friday"]
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      default: [],
    },
    isVerified: {
      type: Boolean,
      default: false, // admin verify karega
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Pathologist = mongoose.model("Pathologist", pathologistSchema);

export default Pathologist;