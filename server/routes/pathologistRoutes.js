import express from "express";
import protect from "../middleware/authMiddleware.js";
import pathologistController from "../controller/pathologist/pathologistController.js";

const router = express.Router();

router.post(
    "/request",
    protect.forUser,
    pathologistController.becomePathologist
);


router.get(
    "/appointments/:aid",
    protect.forUser,
    pathologistController.getAppointment   // geAllAppointments ki jagah getAppointment
);

router.get(
    "/tests",
    pathologistController.getAllPathologyTest
    
);


router.get(
    "/",
    pathologistController.getAllPathologist
    
);


router.get(
    "/appointments",
    protect.forUser,
    pathologistController.geAllAppointments
);





router.post(
    "/add",
    protect.forUser,
    pathologistController.addPathologyTest
);


router.post(
    "/:pid",
    protect.forUser,
    pathologistController.bookTest
);


router.put(
    "/appointments/:aid",
    protect.forUser,
    pathologistController.updateAppointment
);
export default router;