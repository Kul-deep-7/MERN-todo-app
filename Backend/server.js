import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./db/db.js";
import express from "express";


const app = express();

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 7000,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})
.catch((error)=>{
        (error)=>{
        console.error("Failed to start server", error);
        process.exit(1)
    }
})