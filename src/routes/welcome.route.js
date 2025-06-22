import { Router } from "express";
import { verifyjwt } from "../middleware/auth.midleware.js";
import { welcomeController } from "../controller/welcome.controller.js";
const router=Router();

router.get('/',verifyjwt,welcomeController);


export default router;