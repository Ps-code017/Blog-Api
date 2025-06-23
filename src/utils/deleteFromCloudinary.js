import { v2 } from "cloudinary";

const deleteFromCloudinary=async(publicid)=>{
    try {
        const result=await v2.uploader.destroy(publicid)
        console.log("result from delete cloudinary",result)
        return result;
    }
     catch (err) {
        console.error("file deletion error",err.message)
        
    }
}

export {deleteFromCloudinary}
