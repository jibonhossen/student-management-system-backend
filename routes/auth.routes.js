import { Router } from "express";
import {registerValidator, loginValidator, changePasswordValidator, resetForgotPasswordValidator, resendEmailVerificationMailValidator, refreshAccessTokenValidator, forgotPasswordValidator} from "../validators/index.js";
import { validate } from "../middlewares/validator.middlewares.js";
import {registerController,
     loginController,
     logOutUser, 
     getCurrentUser,
     verifyEmail,
     resendEmailVerificationMail,
     refreshAccessToken,
     forgotPassword,
     resetForgotPassword,
     changePassword
     }from "../controllers/auth.controllers.js";


import{ verifyJWT } from "../middlewares/auth.middleware.js"; 

const router = Router();


//public routes
router.route("/register").post(registerValidator, validate, registerController);
router.route("/login").post(loginValidator, validate, loginController);

//public routes
router.route("/verify-email/:VerificationToken").get( validate, verifyEmail);

router.route("/refresh-access-token").post(refreshAccessTokenValidator, validate, refreshAccessToken);
router.route("/forgot-password").post(forgotPasswordValidator, validate, forgotPassword);
router.route("/reset-forgot-password/:resetToken").post(resetForgotPasswordValidator, validate, resetForgotPassword);


//secure route 
router.route("/logout").post(verifyJWT, logOutUser);
router.route("/current-user").post(verifyJWT, getCurrentUser);
router.route("/change-password").post(verifyJWT, changePasswordValidator, validate, changePassword); 
router.route("/resend-email-verification").post(verifyJWT, resendEmailVerificationMailValidator, validate, resendEmailVerificationMail);
export default router;
