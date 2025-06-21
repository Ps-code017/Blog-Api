import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {ApiError} from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import { OAuth2Client } from "google-auth-library"
import { verifyGoogleToken } from "../utils/verifyGoogleToken.js";
import jwt from "jsonwebtoken";
import axios from "axios";

const options={
    httpOnly:true,
    secure: true,

     sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
}
const options_access={
    httpOnly:true,
    secure: true,

    sameSite: "Strict",
    maxAge: 15 * 60 * 1000, 
}

//when idtoken receive from frontend

// const googleAuthController=asyncHandler(async(req,res)=>{

//     const {idToken}=req.body;
//     if(!idToken){
//         throw new ApiError(400,"id token required")
//     }
//     const googleUser=await verifyGoogleToken(idToken);
//     if(!googleUser){
//         throw new ApiError(401,"invalid token")
//     }

//     let user=await User.findOne({email: googleUser.email});

//     if(!user){
//         user=await User.create({
//             name: googleUser.name,
//             email: googleUser.email,
//             avatar: googleUser.avatar,
//             googleId: googleUser.googleId,
//             authProvider: "google",
//         })
//     }
//     const accessToken=user.generateAccessToken()
//     const refreshToken=user.generateRefreshToken()
//     user.refreshToken=refreshToken
//     let loggedInUser=await User.findById(user._id).select("-googleId -refreshToken")
//     await user.save();
//      return res
//             .status(200)  
//             .cookie("accessToken", accessToken, options_access)
//             .cookie("refreshToken", refreshToken, options)
//             .json({ accessToken, refreshToken, user: loggedInUser });
// })

const refreshAccessToken=asyncHandler(async(req,res)=>{
    const refreshTokenfromCookie=req.cookies.refreshToken;

    if(!refreshTokenfromCookie){
        throw new ApiError(401,"login again");
    }
    let decoded_token
    try{
        decoded_token=jwt.verify(refreshTokenfromCookie,process.env.REFRESH_SECRET)
    }catch(err){
        throw new ApiError(403,"Invalid token")
    }

    const user=await User.findById(decoded_token._id)
    if(!user || user.refreshToken!==refreshTokenfromCookie){
        throw new ApiError(403,"token mismatch or user not found")
    }

    const newAccessToken=user.generateAccessToken()
    const newRefreshToken=user.generateRefreshToken()

    user.refreshToken=newRefreshToken
    await user.save();

    return res
    .status(200)
    .cookie("refreshToken", newRefreshToken, options)
    .cookie("accessToken", newAccessToken, options_access)
    .json( new ApiResponse(200,"token success refreshed",{accessToken: newAccessToken} ) );

})

const googleRedirectController = asyncHandler(async (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?` +
              `client_id=${process.env.GOOGLE_CLIENT_ID}` +
              `&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}` +
              `&response_type=code` +
              `&scope=openid%20email%20profile`;

  res.redirect(url);
});

const googleCallbackController=asyncHandler(async(req,res)=>{
    const code=req.query.code
    if (!code) throw new ApiError(400, "Authorization code missing");

    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    grant_type: "authorization_code"
  });

  const idToken=tokenRes.data.id_token

  const googleUser=await verifyGoogleToken(idToken);
    if(!googleUser){
        throw new ApiError(401,"invalid token")
    }

    let user=await User.findOne({email: googleUser.email});

    if(!user){
        user=await User.create({
            name: googleUser.name,
            email: googleUser.email,
            avatar: googleUser.avatar,
            googleId: googleUser.googleId,
            authProvider: "google",
        })
    }
    const accessToken=user.generateAccessToken()
    const refreshToken=user.generateRefreshToken()
    user.refreshToken=refreshToken
    let loggedInUser=await User.findById(user._id).select("-googleId -refreshToken")
    await user.save();
     return res
            .status(200)  
            .cookie("accessToken", accessToken, options_access)
            .cookie("refreshToken", refreshToken, options)
            .json({ accessToken, refreshToken, user: loggedInUser });
})


const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{refreshToken:1}
        },
        {new:true}
    )
    return res.status(200).clearcookie("accessToken",options_access).clearcookie("refreshToken",options).json(new ApiResponse(200,"user logged out"))
})

export{
    // googleAuthController,
    googleRedirectController,
    googleCallbackController,
    refreshAccessToken,
    logoutUser
}

