import express from 'express'
import verifyJwt from '../middlewares/auth.middleware.js';
import { createRoom, getAllRooms, joinRoom } from '../controller/chat.controller.js';
import { getMessagesFromRoom, handleMessage } from '../controller/message.controller.js';
import { upload } from '../middlewares/multer.middleware.js';


const chatrouter = express.Router();

// chat routes
chatrouter.route("/create-room").post(verifyJwt, createRoom);
chatrouter.route("/join-room").post(verifyJwt, joinRoom);
chatrouter.route("/get-all-rooms").get(getAllRooms);



// messages routes
chatrouter.route("/send-message").post(verifyJwt,
     upload.array("attachments", 5),
    handleMessage);

chatrouter.route("/get-messages").get(verifyJwt, getMessagesFromRoom);

export default chatrouter;