import express from "express"
import adminService from "../controller/admin/adminController.js"
import protect from "../middleware/authMiddleware.js"
import upload from "../middleware/fileUploadMiddleware.js"

const router = express.Router()

router.get("/users", protect.forAdmin, adminService.getAllUser)
router.get("/products", protect.forAdmin, adminService.getAllProducts)
router.get("/pathologists", protect.forAdmin, adminService.getAllPathologists)

router.post("/product", protect.forAdmin, upload.single("image"), adminService.addProduct)


router.put("/pathologists/:id", protect.forAdmin, adminService.updatePathologists)
router.put("/product/:pid", protect.forAdmin, adminService.updateProduct)
router.post("/doctor/:id", protect.forAdmin, adminService.updateDoctor)

export default router