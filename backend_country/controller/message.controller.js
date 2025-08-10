import { io } from "../index.js";
import chatMessages from "../models/chatMessage.model.js";
import chartRoom from "../models/rooms.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandeller.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";


export const handleMessage = asyncHandler(async (req, res) => {

        const { content, room_name } = req.body;
        const senderId = req.user?._id;

        // Validate early
        if (!room_name) throw new ApiError(400, "Room name is required");
        if (!senderId) throw new ApiError(401, "User not authenticated");

        const room = await chartRoom.findOne({ roomName: room_name });
        if (!room) throw new ApiError(404, "Room not found");
        const room_id = room._id;
        if (!room.participants.includes(senderId)) {
            throw new ApiError(403, "User not authorized to send messages in this room");
        }
        

        const attachment = req?.file || req.files?.[0];
        if (!content && !attachment) {
            throw new ApiError(400, "Message content or attachment is required");
        }
        let attachments = [];
        
        if(attachment){
            const buffer= attachment.buffer;
            const filename= attachment.originalname;
            const file=await uploadOnCloudinary(buffer, filename);
            if(!file?.url && !file?.secure_url) {
                throw new ApiError(500, "Error uploading attachment");
            }

            attachments.push({
                url: file?.url || file?.secure_url,
                filename: filename
            });


        }
        const savedMessage= await chatMessages.create({
            sender: senderId,
            message: content,
            room_id,
            attachments,

        });
        await savedMessage.populate("sender", "-password -refreshToken");
        if (!savedMessage) {
            throw new ApiError(500, "Error saving message");
        }

        io.to(room.roomName).emit("message", savedMessage);
        console.log(`Message sent in room ${room.roomName}:`, savedMessage);

        return res.status(201).json({
            status: "success",
            data: {
                message: { ...savedMessage.toObject(),
                    attachments: attachments.length > 0 ? attachments : savedMessage.attachments
                }
            },
            message: "Message sent successfully"
        });

    
})


export const getMessagesFromRoom = asyncHandler(async (req, res) => {
  const { room_name, page = 1, limit = 50 } = req.query;
  if (!room_name) throw new ApiError(400, "Room name is required");

  const room = await chartRoom.findOne({ roomName: room_name });
  if (!room) throw new ApiError(404, "Room not found");

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const pageSize = Math.min(200, Math.max(1, parseInt(limit, 10) || 50));
  const skip = (pageNum - 1) * pageSize;

  const messages = await chatMessages
    .find({ room_id: room._id })
    .populate("sender", "-password -refreshToken")
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(pageSize)
    .lean();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { messages, meta: { page: pageNum, limit: pageSize } },
        "Messages fetched successfully"
      )
    );
});