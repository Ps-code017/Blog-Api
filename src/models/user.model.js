// src/models/user.model.js
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String, 
  },
  authProvider: {
    type: String, 
    default: "google",
  },
  refreshToken: {
        type: String,
        default: "",
    },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  googleId: { type: String, unique: true },
}, {
  timestamps: true,
});


userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        _id:this._id,
        googleId:this.googleId
    },
    process.env.REFRESH_SECRET,
    {
        expiresIn:process.env.REFRESH_EXPIRY
    }
)};

userSchema.methods.generateAccessToken=function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        googleId:this.googleId
    },
    process.env.ACCESS_SECRET,
    {
        expiresIn:process.env.ACCESS_EXPIRY
    }
)};


export const User = mongoose.model("User", userSchema);
