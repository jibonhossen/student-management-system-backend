import { Router } from "express";
import { mobileLoginController, mobileRegisterController, mobileLogoutController } from "../controllers/auth.mobile.controllers.js";

const router = Router();

router.post('/login', mobileLoginController);
router.post('/register', mobileRegisterController);
router.post('/logout', mobileLogoutController);

export default router;