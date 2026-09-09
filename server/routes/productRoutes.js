import express, { Router } from "express"
import productController from "../controller/products/productController.js"

console.log("Product Controller:", productController)  // ADD THIS LINE

const router = express.Router()

router.get("/" , productController.getProducts)
router.get("/:pid" , productController.getProduct)


export default router