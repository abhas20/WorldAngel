import userSignUp from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandeller.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import {ApiResponse} from '../utils/ApiResponse.js'
import jwt from 'jsonwebtoken'


const generateAccessTokenAndRefreshToken=async (userId)=>{
    try {
        const user=await userSignUp.findOne(userId);
        const accessToken=await user.generateAccessToken()
        const refreshToken=await user.generateRefreshToken()

        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}
        
    } catch (error) {
        throw new ApiError(500,"something went wrong error in generating access token and refresh token");
    }
}

//--Create User--//
const createUser= asyncHandler(async (req,res)=>{
    const {username,email,password}=req.body
    // checking if user exists
    if(username.trim()==="" || email==="" ||  password===""){
        throw new ApiError(400,"all fields are required")
    }
    const existingUser=await userSignUp.findOne({
        $or:[{username},{password}]
    })
    if(existingUser) throw new ApiError(409,"User already exists")
    
    // Uploading on cloudinary
    const localPath = req.files?.avatar?.[0]?.path;
    let avatar=null;
    if (localPath) {
        const avatar=await uploadOnCloudinary(localPath);
        if(!avatar) throw new ApiError(400,"avatar is required")
    }

    const user=await userSignUp.create({
        username:username.toLowerCase(),
        email,
        password,
        avatar:avatar?.url || "https://res.cloudinary.com/ds6lixr1g/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1745775700/samples/smile.jpg"
    })
    const newUser=await userSignUp.findById(user._id).select("-password -refreshToken");
    if(!newUser) throw new ApiError(500,"New error")

        return res.status(201).json(
            new ApiResponse(200, newUser, "User created successfully")
        )
})

//--Login--//(pass:blast#123)
const loginUser=asyncHandler(async (req,res)=>{
    const {username,email,password}=req.body;
    if(!username && !email){
        throw new ApiError(400,"username or email is required")
    }
    const user=await userSignUp.findOne({
        $or:[{username},{email}]
    })
    if(!user) throw new ApiError(404,"User not found")
    const isValid=await user.isPasswordCorrect(password);
    if(!isValid) throw new ApiError(404,"User not valid")

    const {accessToken,refreshToken}=await generateAccessTokenAndRefreshToken(user._id)

    const loggedInUser=await userSignUp.findById(user._id).select("-password -refreshToken")

    const option={
        httpOnly:true,
        secure:true,
        sameSite: "None", // REQUIRED for cross-site cookies
    }
    return res.status(200).cookie("accessToken",accessToken,option).cookie("refreshToken",refreshToken,option)
    .json(new ApiResponse(200,{user:loggedInUser,accessToken,refreshToken}, "User logged in successfully"))

})

//--Logout User--//
const logoutUser=asyncHandler(async(req,res)=>{
    await userSignUp.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:1
            }
        },
        {
            new:true
        }
    )
    const option={
        httpOnly:true,
        secure:true,
        sameSite: "None", // REQUIRED for cross-site cookies
    }
    res.status(200).clearCookie("accessToken", option).clearCookie("refreshToken",option)
    .json(new ApiResponse(200,{},"User logged out successfully"))
})

//--Refresh Token--//
const refreshAccessToken=asyncHandler(async (req,res)=>{
    const incommingRefreshToken=req.cookies.refreshToken || req.body.refreshToken
    if(!incommingRefreshToken) throw new ApiError(401,"Unauthorized access")
    
    try {
        const decodedToken=jwt.verify(incommingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
        const user = await userSignUp.findById(decodedToken?._id);
        if(!user) throw new ApiError(401,"User not valid")
    
        if(incommingRefreshToken!==user?.refreshToken) throw new ApiError(401,"Refresh token is used or expired")
            const option={
                httpOnly:true,
                secure:true,
                sameSite: "None", // REQUIRED for cross-site cookies
            }
        const {accessToken,refreshToken:newrefreshToken}=await generateAccessTokenAndRefreshToken(user._id)
        return res.status(200).cookie("accessToken",accessToken,option).cookie("refreshToken",newrefreshToken,option)
        .json(new ApiResponse(200,{accessToken,refreshToken:newrefreshToken}, "Access token refreshed"))
        
    } catch (error) {
        throw new ApiError(error?.message || "Error occured in renewing refreshToken")
    }
})

//--Change Password--//
const changePassword=asyncHandler(async (req,res)=>{
    const {currentPassword,newPassword}=req.body;
    if(!currentPassword) throw new ApiError(401,"Enter your current password");
    if (!newPassword) 
        throw new ApiError(401, "Enter your new password")
    
    const user=await userSignUp.findById(req.user?._id).select("-refreshToken");
    const isValid = await user.isPasswordCorrect(currentPassword);
    if(!isValid)  throw new ApiError(401, "Incorrect password");

    user.password=newPassword;
    await user.save({validateBeforeSave:false});

    const userObj=user.toObject;
    delete userObj.password;

    return res.status(200).json(new ApiResponse(200,{userObj},"Changed password successfully"))


})

// --Change Photo---//

const updateUserAvatar=asyncHandler(async (req,res)=>{
    const localPath=req.file?.path;
    if(!localPath) throw new ApiError(401,"Avatar file is missing")

    const newAvatar= await uploadOnCloudinary(localPath);
    if(!newAvatar?.url) throw new ApiError(401,"Error in uploading the file ");
    const user=await userSignUp.findById(req.user?._id).select("-password -refreshToken")
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    user.avatar=newAvatar?.url;
    await user.save();

    return res.status(200).json(new ApiResponse(200,user,"Updated Successfully"));

})



//--Get User--//

const getUser= asyncHandler(async (req,res)=>{
    return res.status(200).json(new ApiResponse(200,req.user,"User found succesfully"))

})

export {createUser,getUser,loginUser,logoutUser,changePassword,refreshAccessToken,updateUserAvatar}