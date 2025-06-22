import { Router } from "express";
import { verifyjwt } from "../middleware/auth.midleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { createPost } from "../controller/post.controller.js";
const router=Router();

router.post("/create",verifyjwt,upload.single("image"),createPost)

export default router