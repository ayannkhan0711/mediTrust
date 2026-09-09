import Pathologist from "../../models/pathologistModel.js";

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

const pathologistController = { becomePathologist };

export default pathologistController;
