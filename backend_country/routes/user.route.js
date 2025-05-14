import express from 'express'
import  {createUser, loginUser, getUser, logoutUser, refreshAccessToken, changePassword, updateUserAvatar } from '../controller/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import verifyJwt from '../middlewares/auth.middleware.js';


const router=express.Router();
router.route("/signup").post(
    upload.fields([{
        name:"avatar",
        maxCount:1
    }]),
 createUser);


router.route("/current-user").get(verifyJwt,getUser);
router.route("/change-password").post(verifyJwt,changePassword);
router.route("/update-avatar").patch(verifyJwt,upload.single("avatar"),updateUserAvatar);
router.route("/logout").post(verifyJwt,logoutUser);


router.route("/login").post(loginUser)
router.route("/refresh-token").post(refreshAccessToken)


export default router;