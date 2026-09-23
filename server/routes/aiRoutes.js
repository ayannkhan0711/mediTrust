import express from "express"
import protect from "../middleware/authMiddleware.js"
import aiController from "../controller/ai/aiController.js"
import upload from "../middleware/fileUploadMiddleware.js"

const router = express.Router()

router.post("/prescription" , protect.forUser , protect.forUser , upload.single('prescription') , aiController.explainPrescription)
router.get("/find/:pid" , protect.forUser , protect.forUser ,  aiController.findMedicines)
router.get("/chat" , protect.forUser , protect.forUser ,  aiController.chatWithAi)

export default router