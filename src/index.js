import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 3000,()=>{
        console.log("server running !!!",process.env.PORT )
    })
})
.catch((err)=>{
    console.log("connection failed", err)
})