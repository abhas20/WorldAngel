import { io } from "../index.js";
import chartRoom from "../models/rooms.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandeller.js";


export const createRoom = asyncHandler(async (req, res) => {
  const { roomName } = req.body;
  const createdBy = req.user?._id;

  if (!roomName || !createdBy) {
    throw new ApiError(400, "Room name and creator ID are required");
  }

  if (typeof roomName !== "string" || roomName.trim().length < 1) {
    throw new ApiError(400, "Invalid room name");
  }

  const existingRoom = await chartRoom.findOne({ roomName });
  if (existingRoom) {
    throw new ApiError(400, "Room already exists");
  }

  const newRoom = await chartRoom.create({
    roomName,
    createdBy,
    participants: [createdBy],
  });

  if (!newRoom) {
    throw new ApiError(500, "Error creating room");
  }

  const socketIo = req?.app?.get("io") || io;
  if (socketIo) socketIo.emit("room_created", newRoom);

  return res.status(201).json({
    status: "success",
    data: { room: newRoom },
    message: "Room created successfully",
  });
});

export const getAllRooms = asyncHandler(async (req, res) => {
    const rooms = await chartRoom
      .find()
      .populate("participants", "-password -refreshToken")
      .lean();

    return res.status(200).json({
      status: "success",
      data: { rooms },
      message: "Rooms fetched successfully",
    });
});


export const joinRoom = asyncHandler(async (req, res) => {
    const { roomName } = req.body;
    const userId = req.user?._id;

    if (!roomName || !userId) {
      throw new ApiError(400, "Room name and user ID are required");
    }

    const room = await chartRoom.findOne({ roomName });
    if (!room) {
      throw new ApiError(404, "Room not found");
    }

    // Use atomic update to avoid race and duplicates
    const updateRes = await chartRoom.updateOne(
      { roomName },
      { $addToSet: { participants: userId } } // $addToSet ensures no duplicates
    );

    if (updateRes.modifiedCount === 0) {
      return res.status(400).json({
        status: "error",
        message: "User already in the room",
      });
    }

    const updatedRoom = await chartRoom
      .findOne({ roomName })
      .populate("participants", "-password -refreshToken");

    // Emit socket event to room members
    const socketIo = req?.app?.get("io") || io;
    if (socketIo) {
      socketIo.to(updatedRoom.roomName).emit("user_joined", {
        userId,
        roomId: updatedRoom._id.toString(),
        roomName: updatedRoom.roomName,
      });
    }

    return res.status(200).json({
      status: "success",
      data: { room: updatedRoom },
      message: "User joined the room successfully",
    });
})