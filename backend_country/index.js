import {app} from "./app.js"
import connectDB from "./config/db.js";

const PORT=8080;

app.get("/",(req,res)=>{
    console.log(req.baseUrl)
    res.send("Hello Nice to meet !!! ");
})

connectDB().then(()=>{
    try {
        app.listen(PORT,()=>{
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (error) {
        console.log("Error occured in Server",error);
        process.exit();
    }
})