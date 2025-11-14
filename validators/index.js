import { body } from "express-validator";


const registerValidator = [
    body("username").notEmpty().withMessage("Username is required").isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Email is invalid"),
    body("password").notEmpty().withMessage("Password is required").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
]

const loginValidator = [
    body("email").optional().isEmail().withMessage("Email is invalid"),
    body("password").notEmpty().withMessage("Password is required").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
]

const changePasswordValidator = [
    body("oldPassword").notEmpty().withMessage("Old password is required").isLength({ min: 6 }).withMessage("Old password must be at least 6 characters long"),
    body("newPassword").notEmpty().withMessage("New password is required").isLength({ min: 6 }).withMessage("New password must be at least 6 characters long"),
]

const resetForgotPasswordValidator = [
    body("password").notEmpty().withMessage("Password is required").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
]



const resendEmailVerificationMailValidator = [
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Email is invalid"),
]

const refreshAccessTokenValidator = [
    body("refreshToken").notEmpty().withMessage("Refresh token is required"),
]

const forgotPasswordValidator = [
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Email is invalid"),
]



export {registerValidator, loginValidator, changePasswordValidator, resetForgotPasswordValidator, resendEmailVerificationMailValidator, refreshAccessTokenValidator, forgotPasswordValidator};
