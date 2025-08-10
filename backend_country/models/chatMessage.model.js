import mongoose from "mongoose";


const chatMessageSchema = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userSignUp",
        required:true,
    },
    message:{
        type:String,
        trim:true,
        required:true,
    },
    attachments:[
        {
            url:{
            type:String,
            },
            filename:{
                type:String,
            },
        }
        
    ],
    room_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ChartRoom",
        required:true,
    }
},
{
    timestamps:true,
    
}
)

chatMessageSchema.index({ room_id: 1, createdAt: -1 });

const chatMessages=mongoose.model("ChatMessage",chatMessageSchema);
export default chatMessages;