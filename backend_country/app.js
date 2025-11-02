import express from "express";
import router from "./routes/user.route.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import chatrouter from "./routes/chat.route.js";
const app=express();

app.use(cors({
    origin:["http://localhost:5173","https://world-angel.vercel.app"],
    credentials:true
}))
app.use(express.urlencoded({extended:true})); // for parsing application/x-www-form-urlencoded //extended: true allows nested objects
app.use(cookieParser()); 


app.use(express.json());
app.use("/api/v1/user",router);
app.use("/api/v1/chat",chatrouter);

export {app}