import mongoose from "mongoose";
import { ref } from "process";

const pathlogyTestSchema = new mongoose.Schema({

    pathologist : {
type: mongoose.Schema.Types.ObjectId,
ref: "Pathologist",
required: true
    },

    title : {
        type : String,
        required : true
    },
    description :{
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },





} , {
    timestamps: true
})


const PathologyTest = mongoose.model("PathologyTest" , pathlogyTestSchema)

export default PathologyTest