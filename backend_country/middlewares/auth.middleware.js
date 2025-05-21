import { ApiError } from "../utils/ApiError.js";
import jwt from 'jsonwebtoken'
import { asyncHandler } from "../utils/asyncHandeller.js";
import userSignUp from "../models/userModel.js";
import dotenv from 'dotenv'

dotenv.config({
    path: './.env'
});


const verifyJwt = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log("Token received:", token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request: Token is missing or invalid");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await userSignUp.findById(decodedToken?._id).select("-password -refreshToken");
        if (!user) throw new ApiError(400, "Invalid access token");
        req.user=user
    
        next();
    } catch (error) {
        throw new ApiError(401, error?.message|| "Invalid Access token");
        
    }
});

export default verifyJwt;