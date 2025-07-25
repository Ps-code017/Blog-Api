import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import slugify from "slugify";
import fs from "fs"
import { uploadOnCloundinary } from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary.js";

const createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    throw new ApiError(400, "all field necessary");
  }
  const slug = slugify(title, { lower: true })
  // console.log("this is slig",slug)
  let image_url = "", public_id = ""

  if (req.file) {
    // console.log(req.file)
    const uploaded_image = await uploadOnCloundinary(req.file.path);
    if (!uploaded_image.url) {
      throw new ApiError(400, "Error in uploading file")
    }

    image_url = uploaded_image.url
    public_id = uploaded_image.public_id
  }
  // console.log("deleting file")
  try {
    fs.unlinkSync(req.file.path)
  } catch (err) {
    throw new ApiError(500, `${err.message}`)

  }

  const post = await Post.create({
    title, content, image: image_url, slug, author: req.user._id, public_id
  })
  return res.status(200).json(new ApiResponse(200, "post created", { post }))

})

const getAllPosts = (asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id

    const post = await Post.find({ author: userId });
    return res.status(200).json(new ApiResponse(200, "all post fetched", { posts: [post] }))
  } catch (err) {
    throw new ApiError(500, "error while getting posts")

  }
}))

const getPostBySlug = asyncHandler(async (req, res) => {
  const slug = req.params.slug
  if (!slug) {
    throw new ApiError(400, "provide slug for post")
  }
  const post = await Post.findOne({ slug })
  if (!post) {
    throw new ApiError(400, "wrong slug")
  }
  return res.status(200).json(new ApiResponse(200, "post is", { post }))
})

const updatePostBySlug = asyncHandler(async (req, res) => {
  const slug = req.params.slug;
  if (!slug) {
    throw new ApiError(400, "Provide slug for the post");
  }

  const existedPost = await Post.findOne({ slug });
  if (!existedPost) {
    throw new ApiError(404, "Post not found");
  }

  const { title, content } = req.body;


  let updatedSlug = existedPost.slug;
  let updatedTitle = existedPost.title;
  let updatedContent = existedPost.content;
  let updatedImage = existedPost.image;
  let updatedImagePublicId = existedPost.public_id;


  if (title) {
    updatedTitle = title;
    updatedSlug = slugify(title, { lower: true });
  }

  if (content) {
    updatedContent = content;
  }


  if (req.file) {
    try {

      if (existedPost.public_id) {
        console.log(existedPost.public_id)
        await deleteFromCloudinary(existedPost.public_id);
      }

      const uploaded_image = await uploadOnCloundinary(req.file.path);
      if (!uploaded_image.url) {
        throw new ApiError(400, "Error uploading new image");
      }

      updatedImage = uploaded_image.url;
      updatedImagePublicId = uploaded_image.public_id;

      fs.unlinkSync(req.file.path);
    } catch (err) {
      throw new ApiError(500, "Error while handling image update");
    }
  }


  const updatedPost = await Post.findByIdAndUpdate(
    existedPost._id,
    {
      title: updatedTitle,
      content: updatedContent,
      slug: updatedSlug,
      image: updatedImage,
      public_id: updatedImagePublicId,
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Post updated successfully", { post: updatedPost }));
});

const deletePost = asyncHandler(async (req, res) => {
  const slug = req.params.slug
  if (!slug) {
    throw new ApiError(400, "provide slug");
  }
  const existedPost = await Post.findOneAndDelete({ slug })
  if (!existedPost) {
    throw new ApiError(400, "slug incorrect")
  }
  const image_url = existedPost.image;
  const public_id = existedPost.public_id
  if (image_url && public_id) {
    try {
      await deleteFromCloudinary(public_id)
    } catch (err) {
      throw new ApiError(500, `err while deleting cloudinary ${err.message}`)

    }
  }

  return res.status(200).json(new ApiResponse(200, "post deleted"))

})


export {
  createPost,
  getAllPosts,
  getPostBySlug,
  updatePostBySlug,
  deletePost
}