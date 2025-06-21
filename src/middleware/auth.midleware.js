import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";


const verifyjwt=asyncHandler(async(req,res)=>{
    const accessToken=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
    if(!accessToken){
        throw new ApiError(400,"unauthorized request");
    }
    let decoded_token
    try{
        decoded_token=jwt.verify(accessToken,process.env.ACCESS_SECRET)
    }catch{
        throw new ApiError(400,"token not match")
    }
    const user=await User.findOne({
            _id:decoded_token?._id,
            googleId:decoded_token?.gid
        }).select("-googleId -refreshToken")
        if(!user){
            throw new ApiError(401,"invalid token")
        }
        req.user=user
        next();
    
})

export {verifyjwt}