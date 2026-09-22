const mongoose = require("mongoose");

const MedicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dosage: {
      type: String,
      default: null,
    },
    frequency: {
      type: String,
      default: null,
    },
    duration: {
      type: String,
      default: null,
    },
    instructions: {
      type: String,
      default: null,
    },
    confidence: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
  },
  { _id: false }
);

const PrescriptionSchema = new mongoose.Schema(
  {
    patient_name: {
      type: String,
      default: null,
    },
    doctor_name: {
      type: String,
      default: null,
    },
    date: {
      type: String, // kept as string since source format varies (e.g. "21/8/24")
      default: null,
    },
    medicines: {
      type: [medicineSchema],
      default: [],
    },
    notes: {
      type: String,
      default: null,
    },
    image: {
      type: String, // Cloudinary URL
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // adjust/remove if you don't have a User model
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prescription", PrescriptionSchema);