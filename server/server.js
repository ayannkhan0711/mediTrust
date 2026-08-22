import express from "express"
import dotenv from "dotenv"
import colors from "colors"



dotenv.config()


const PORT = 5000

const app = process.env.PORT || express()


app.listen(PORT , () => {
    console.log(`SERVER IS RUNNING AT PORT : ${PORT} `.bgBlue)
})