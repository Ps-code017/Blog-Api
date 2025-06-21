import { Router } from "express";
import { googleCallbackController, googleRedirectController, logoutUser,/*googleAuthController,*/refreshAccessToken } from "../controller/auth.controller.js";
import { verifyjwt } from "../middleware/auth.midleware.js";
const router=Router();

//all for id_tokens

// router.post("/google",googleAuthController)

// for backend redirect_url
router.get("/google",googleRedirectController)
router.get("/google/callback",googleCallbackController)
router.post("/refresh-token",refreshAccessToken)
router.post("/logout",verifyjwt,logoutUser)


export default router