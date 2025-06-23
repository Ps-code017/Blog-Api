
import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug:{
    type:String
  },
  content: {
    type: String,
  },
  image: {
    type: String,
    default:"" 
  },
  public_id:{
    type:String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: true,
});

export const Post = mongoose.model("Post", postSchema);
