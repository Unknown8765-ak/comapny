import dbConnection from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js"
import Razorpay from "razorpay"
dotenv.config({
    path : "./.env"
})

export const instance = new Razorpay({
  key_id: process.env.Test_API_Key,
  key_secret: process.env.Test_Key_Secret ,

});




const PORT = process.env.PORT || 8000;

dbConnection()
    .then(()=>{
        app.listen(PORT ,()=>{
            console.log(`server is running on Port ${process.env.PORT || 8000}`)
        })
    })
    .catch((error)=>{
        console.log("mongoose connection error" , error);
    })
