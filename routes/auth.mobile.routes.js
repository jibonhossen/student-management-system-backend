import { Router } from "express";
import { mobileLoginController } from "../controllers/auth.mobile.controllers.js";

const router = Router();

router.post('/login', mobileLoginController);


export default router;