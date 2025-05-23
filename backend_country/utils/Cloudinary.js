import { v2 as cloudinary } from 'cloudinary';
import fs, { unlink, unlinkSync } from "fs" 
import { promisify } from 'util';
import streamifier from 'streamifier';

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

    const uploadOnCloudinary=async (input)=>{
        try {
            if(!input) return null
            if(typeof input=="string"){
            const response =await cloudinary.uploader.upload(input,{ // using Local storage // diskstorage
                resource_type:"auto"
            })
            const url=cloudinary.url(response.public_id,{
                secure:true,
                transformation:[
                    {
                        quality:"auto",
                        fetch_format: 'auto'
                    }
                ]
            })
            console.log("file uploaded successfully",url,response.created_at);
            await unlinkAsync(input);
            return response;
        }
         const streamUpload = () =>
            new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(   //using memory storage
          {
            resource_type: "auto",
            transformation:[
                    {
                        quality:"auto",
                        fetch_format: 'auto'
                    }
                ],
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        streamifier.createReadStream(input).pipe(stream);
      });

    const bufferUpload = await streamUpload();
    console.log("File uploaded from buffer:", bufferUpload.secure_url);
    return bufferUpload;

} 
        catch (error) {
            if(typeof input=="string") await unlinkAsync(input)
            console.log("cloudinary error: ",error);
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