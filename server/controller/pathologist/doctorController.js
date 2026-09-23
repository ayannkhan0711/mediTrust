import DoctorAppointment from "../../models/doctorAppointmentModel.js";
import Doctor from "../../models/doctorModel.js";
import User from "../../models/userModel.js";


const becomeDoctor = async (req, res) => {

    let userId = req.user.id

    const {clinicName , address, qualification, registrationNumber , experience , specialization , phone , email, consultationFee , workingHours , availableDays , isVerified , isActive } = req.body


    if(!clinicName|| !address|| !qualification|| !registrationNumber || !experience || !specialization || !phone || !email || !consultationFee || !workingHours || !availableDays ){
        res.status(409)
        throw new Error("Please Fill All Details");
        
    }

    const newDoctor = await Doctor.create({user : userId , clinicName, address, qualification, registrationNumber , experience , specialization , phone , email, consultationFee , workingHours , availableDays , isVerified , isActive})


    if(!newDoctor){
      res.status(409)
      throw new Error("Doctor Not Created");
      
    }

    res.status(200).json(newDoctor)

};


const geAllAppointments = async (req, res) => {

    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error("No user Found");
    }

    if (user.userType !== "DOCTOR") {
        res.status(401);
        throw new Error("you are not a Doctor");
    }

    const doctor = await Doctor.findOne({ user: user._id });

    if (!doctor) {
        res.status(404);
        throw new Error("Doctor not found");
    }

    const appointments = await DoctorAppointment.find({
        doctor: doctor._id
    });

    if (appointments.length === 0) {
        res.status(404);
        throw new Error("appointments not found");
    }

    res.status(200).json(appointments);
};


const updateAppointment = async (req , res ) => {
    const appointmentId = req.params.aid 

    const appointment = await DoctorAppointment.findById(appointmentId)

    if(!appointment){
        res.status(404)
        throw new Error("Appointment Does not exists");
        
    }

    const updatedappointment = await DoctorAppointment.findByIdAndUpdate(appointmentId , req.body , {new : true} ).populate('user').populate('doctor')

     if(!updatedappointment){
        res.status(409)
        throw new Error("Appointment not Updated");
    }
    res.status(200).json(updatedappointment)
}

const getAppointment  = async (req , res ) => {
    const appointmentId = req.params.aid 

    const appointment = await DoctorAppointment.findById(appointmentId)
    .populate("user")
    .populate("doctor")
    

    if(!appointment){
        res.status(404)
        throw new Error("Appointment Does not exists");
        
    }

    
    res.status(200).json(appointment)
}


const getAllDoctors  = async (req , res ) => {
   

    const doctors = await Doctor.find().populate("user")
   


    if(!doctors){
        res.status(404)
        throw new Error("Doctors Does not exists");
        
    }

    
    res.status(200).json(doctors)
}


const bookAppointment = async (req , res ) => {


    const userId = req.user.id
    const did = req.params.did




    const appointment = new DoctorAppointment({user :userId , doctor : did  })

    await appointment.save()
    await appointment.populate("user")
    await appointment.populate('doctor')
   


    if(!appointment){
        res.status(409)
        throw new Error(" appointment Not Booked"); 

}

res.status(201).json(appointment)

}


const doctorController = {
    becomeDoctor,
    geAllAppointments,
    updateAppointment,
    getAppointment,
    getAllDoctors,
    bookAppointment
}

export default doctorController

