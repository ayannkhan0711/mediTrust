import Pathologist from "../../models/pathologistModel.js";
import PathologyAppointment from "../../models/pathologyAppointment.js";
import PathologyTest from "../../models/pathologyTest.js";
import User from "../../models/userModel.js";

const becomePathologist = async (req, res) => {

    let userId = req.user.id

    const {laboratoryName, laboratoryAddress, qualification, registrationNumber , experience , specialization , phone , email, consultationFee , workingHours , availableDays , isVerified , isActive } = req.body


    if(!laboratoryName|| !laboratoryAddress|| !qualification|| !registrationNumber || !experience || !specialization || !phone || !email || !consultationFee || !workingHours || !availableDays ){
        res.status(409)
        throw new Error("Please Fill All Details");
        
    }

    const newPathologist = await Pathologist.create({user : userId , laboratoryName, laboratoryAddress, qualification, registrationNumber , experience , specialization , phone , email, consultationFee , workingHours , availableDays , isVerified , isActive})


    if(!newPathologist){
      res.status(409)
      throw new Error("Pathologist Not Found");
      
    }

    res.status(200).json(newPathologist)

};

const addPathologyTest = async (req , res) => {
  const userId = req.user.id


    const user = await User.findById(userId)

    if (!user) {
        res.status(404)
        throw new Error("No user Found")
    }

    if (user.userType !== "PATHOLOGIST") {
        res.status(401)
        throw new Error("you are not a pathologist")
    }

    const pathologist = await Pathologist.findOne({ user: user._id })



    if (!pathologist) {
        res.status(404)
        throw new Error("Pathologist profile not found")
    }
    const {title , description , price} = req.body

    if(!title || !description || !price){
        res.status(409)
        throw new Error("Please Fill All Details ");
        
    }

    const pathologyTest = await PathologyTest.create({pathologist : pathologist._id , title , description , price})

    if(!PathologyTest){
        res.status(409)
        throw new Error("Pathology Test Not found ");
        
    }
    

    res.status(201).json(pathologyTest)
}

const geAllAppointments = async (req, res) => {

    const userId = req.user.id

    const user = await User.findById(userId)

    if (!user) {
        res.status(404)
        throw new Error("No user Found")
    }

    if (user.userType !== "PATHOLOGIST") {
        res.status(401)
        throw new Error("you are not a pathologist")
    }

    const pathologist = await Pathologist.findOne({ user: user._id })

    if (!pathologist) {
        res.status(404)
        throw new Error("Pathologist profile not found")
    }



    const appointments = await PathologyAppointment.find({ pathologist: pathologist._id })

    res.status(200).json(appointments)
}


const updateAppointment = async (req , res ) => {
    const appointmentId = req.params.aid 

    const appointment = await PathologyAppointment.findById(appointmentId)

    if(!appointment){
        res.status(404)
        throw new Error("Appointment Does not exists");
        
    }

    const updatedappointment = await PathologyAppointment.findByIdAndUpdate(appointmentId , req.body , {new : true} )

     if(!updatedappointment){
        res.status(409)
        throw new Error("Appointment not Updated");
    }
    res.status(200).json(updatedappointment)
}


const getAppointment  = async (req , res ) => {
    const appointmentId = req.params.aid 

    const appointment = await PathologyAppointment.findById(appointmentId)
    .populate("user")
    .populate("pathologist")
    .populate("pathologyTest")

    if(!appointment){
        res.status(404)
        throw new Error("Appointment Does not exists");
        
    }

    
    res.status(200).json(appointment)
}



const getAllPathologyTest  = async (req , res ) => {
   

    const tests = await PathologyTest.find().populate("pathologist")
   


    if(!tests){
        res.status(404)
        throw new Error("Tests Does not exists");
        
    }

    
    res.status(200).json(tests)
}


const bookTest = async (req , res ) => {


    const userId = req.user.id
    const pid = req.params.pid
    const {pathologyTest} = req.body


    if(!pathologyTest){
        res.status(409)
            throw new Error("Add PathologyTest");
            
        
    }

    const testBooking = new PathologyAppointment({user :userId , pathologist : pid , pathologyTest : pathologyTest })

    await testBooking.save()
    await testBooking.populate("user")
    await testBooking.populate('pathologist')
    await testBooking.populate('pathologyTest')



    if(!testBooking){
        res.status(409)
        throw new Error("Pathology Test Not Booked"); 

}

res.status(201).json(testBooking)

}






const pathologistController = { becomePathologist , addPathologyTest , bookTest , geAllAppointments , updateAppointment, getAppointment, getAllPathologyTest};

export default pathologistController;
