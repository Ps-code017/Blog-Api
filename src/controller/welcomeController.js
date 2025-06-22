import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

const welcomeController=asyncHandler((req,res)=>{
    return res.status(200).json(new ApiResponse(200,`hi ${req.user.name}`,{email:req.user.email,name:req.user.name}));
})

export{welcomeController}