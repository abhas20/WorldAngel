import express from "express";
import router from "./routes/user.route.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app=express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.urlencoded({extended:true})); // for parsing application/x-www-form-urlencoded
app.use(cookieParser()); 


app.use(express.json());
app.use("/api/v1/user",router);

export {app}