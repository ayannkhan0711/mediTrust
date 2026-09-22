import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
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

const prescriptionSchema = new mongoose.Schema(
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
      type: String,
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
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);

export default Prescription;