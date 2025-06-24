import { Router } from "express";
import { verifyjwt } from "../middleware/auth.midleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { createPost, deletePost, getAllPosts, getPostBySlug, updatePostBySlug } from "../controller/post.controller.js";
const router=Router();

router.post("/create",verifyjwt,upload.single("image"),createPost)
router.get('/',verifyjwt,getAllPosts)
router.route('/:slug').get(verifyjwt,getPostBySlug).put(verifyjwt,upload.single('image'),updatePostBySlug).delete(verifyjwt,deletePost)

export default router