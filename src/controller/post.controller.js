import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import slugify from "slugify";
import fs from "fs"
import { uploadOnCloundinary } from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";

const createPost=asyncHandler(async(req,res)=>{
    const {title,content}=req.body;
    if(!title || !content){
        throw new ApiError(400,"all field necessary");
    }
    const slug=slugify(title,{lower:true})
    console.log("this is slig",slug)
    let image_url="";

    if(req.file){
        console.log(req.file)
        const uploaded_image=await uploadOnCloundinary(req.file.path);
        if(!uploaded_image.url){
            throw new ApiError(400,"Error in uploading file")
        }
        image_url=uploaded_image.url;
    }
    console.log("deleting file")
    try {
        fs.unlinkSync(req.file.path)
    } catch (err) {
        throw new ApiError(500,`${err.message}`)
        
    }
    
    const post=await Post.create({
        title,content,image:image_url,slug,author:req.user._id
    })
    return res.status(200).json(new ApiResponse(200,"post created",{post}))

})


export{
    createPost

}