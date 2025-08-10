import mongoose from "mongoose";


const chartRoomSchema=mongoose.Schema({
    roomName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "userSignUp",
    }],
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "userSignUp",
        required: true,
    }
},
{
    timestamps: true,
})

chartRoomSchema.index({ roomName: 1, createdAt: -1 });

const chartRoom = mongoose.model("chartRoom", chartRoomSchema);

export default chartRoom;