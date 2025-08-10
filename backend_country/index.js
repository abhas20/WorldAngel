import {app} from "./app.js"
import connectDB from "./config/db.js";
import {createServer} from 'http';
import { Server } from "socket.io";

import dotenv from 'dotenv';
import setUpSocket from "./config/socket.js";

dotenv.config({
    path: './.env'
});

const PORT=process.env.PORT || 8080;

app.get("/",(req,res)=>{
    console.log(req.baseUrl)
    res.send("Hello Nice to meet !!! ");
})

const httpServer= createServer(app);
const io = new Server(httpServer, {
    cors:{
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"] ,
        credentials:true,
    }
});

setUpSocket(io);

connectDB().then(()=>{
    try {
        httpServer.listen(PORT,()=>{
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (error) {
        console.log("Error occured in Server",error);
        process.exit();
    }
})

export { io }; 