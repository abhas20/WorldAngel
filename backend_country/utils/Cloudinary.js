import { v2 as cloudinary } from 'cloudinary';
import fs, { unlink, unlinkSync } from "fs" 
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config({
    path: './.env'
});


    // made unlink(delete) to return promise
    const unlinkAsync = promisify(fs.unlink);

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });

    const uploadOnCloudinary=async (filePath)=>{
        try {
            if(!filePath) return null
            const response =await cloudinary.uploader.upload(filePath,{
                resource_type:"auto"
            })
            const url=cloudinary.url(response.public_id,{
                transformation:[
                    {
                        quality:"auto",
                        fetch_format: 'auto'
                    }
                ]
            })
            console.log("file uploaded successfully",url,response.created_at);
            await unlinkAsync(filePath);
            return response;
        } catch (error) {
            await unlinkAsync(filePath)
            console.log(error);
        }

    }

    const deletefromCloudinary=async (public_id)=>{
        try {
            if(!public_id) return null
            const response=await cloudinary.uploader.destroy(public_id)
            console.log("file deleted successfully",response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    export {uploadOnCloudinary,deletefromCloudinary}