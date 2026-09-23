import mongoose from "mongoose";

const pathologyAppointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pathologist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pathologist",
      required: true,
    },
    pathologyTest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PathologyTest",
      required: true,
    },
    
    status: {
        type : String,
        enums : ["pending" , "delivered" , "cancelled"],
        default : "pending"
    },
  },
  {
    timestamps: true,
  },
);


const PathologyAppointmentModel = mongoose.model("PathologyAppointment" , pathologyAppointmentSchema)

export default PathologyAppointmentModel