import express from "express";
import protect from "../middleware/authMiddleware.js";
import doctorController from "../controller/pathologist/doctorController.js";


const router = express.Router();

router.post(
    "/request",
    protect.forUser,
   doctorController.becomeDoctor
);


router.get(
    "/appointments",
    protect.forUser,
   doctorController.geAllAppointments   // geAllAppointments ki jagah getAppointment
);




router.get(
    "/",
    doctorController.getAllDoctors
    
);


router.get(
    "/appointments/:aid",
    protect.forUser,
    doctorController.getAppointment
);







router.post(
    "/:did",
    protect.forUser,
    doctorController.bookAppointment
);


router.put(
    "/appointments/:aid",
    protect.forUser,
    doctorController.updateAppointment
);
export default router;