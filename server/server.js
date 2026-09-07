import express from "express"
import dotenv from "dotenv"
import colors from "colors"
import connectDB from "./config/dbconfig.js"




dotenv.config()


import authRoutes from "./routes/authRoutes.js"

import adminRoutes  from "./routes/adminRoutes.js"

import aiRoutes from "./routes/aiRoutes.js"



const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(express.urlencoded())

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







app.listen(PORT , () => {
    console.log(`SERVER IS RUNNING AT PORT : ${PORT} `.bgBlue)
})