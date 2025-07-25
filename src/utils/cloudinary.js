import { v2 } from "cloudinary";
import fs from "fs";


v2.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });

const uploadOnCloundinary=async(localFilePath)=>{
    try {
        // console.log(localFilePath);
        
        if(!localFilePath) return null;
        const response=await v2.uploader.upload(localFilePath,{resource_type:"auto"});
        // console.log("file uploaded succesfully",response.url);
        return response;
    } catch (err) {
        fs.unlinkSync(localFilePath)   
    }
}

export {uploadOnCloundinary}