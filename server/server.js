import express from "express"
import dotenv from "dotenv"
import colors from "colors"
import connectDB from "./config/dbconfig.js"




dotenv.config()


import authRoutes from "./routes/authRoutes.js"

import adminRoutes  from "./routes/adminRoutes.js"

import aiRoutes from "./routes/aiRoutes.js"

import productRoutes from "./routes/productRoutes.js"

import pathologistRoutes from "./routes/pathologistRoutes.js"

import doctorRoutes from "./routes/doctorRoutes.js"

import errorHandler from "./middleware/errorHandler.js"



const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//DB Connection
connectDB()

//middleware
app.use(express.json());

//AUTH ROUTES 
app.use("/api/auth" , authRoutes)


//ADMIN ROUTES

app.use("/api/admin" , adminRoutes)


// AI routes 
app.use ("/api/ai" , aiRoutes)


// Product Routes 

app.use("/api/products" , productRoutes)


//pathologist Routes 

app.use("/api/pathologist" , pathologistRoutes)

 // singular "pathologist"
app.use("/api/pathologist" , pathologistRoutes) 

//Doctor Routes
app.use("/api/doctor" , doctorRoutes)

//Error Handler
app.use(errorHandler)



app.listen(PORT , () => {
    console.log(`SERVER IS RUNNING AT PORT : ${PORT} `.bgBlue)
})

