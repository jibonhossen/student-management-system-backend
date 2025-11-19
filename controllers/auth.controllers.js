import {User} from "../models/user.models.js";
import asyncHandler from "../utils/async-handler.js";
import ApiResponse from "../utils/api-respons.js";
import ApiError from "../utils/api-error.js";
import { sendMail, emailVerificationMailgenContent } from "../utils/mail.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";


const generateAccessAndRefreshToken = async (userId) => {
   try{
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;


    await user.save({ validateBeforeSave: false });


    return {accessToken, refreshToken};
   }catch(error){
    throw new ApiError(500, "Failed to generate access and refresh tokens");
   }
}

 const registerController = asyncHandler(async (req, res) => {



    const body = req.body || {};
    const {username, email, password, role} = body || {};
   
    if (!username || !email || !password) {
        throw new ApiError(400, "username, email and password are required");
    }

    const existingUser = await User.findOne({
        $or: [{email}, {username}]
    });
    
    if (existingUser) {
        // throw new ApiError(400, "User already exists");
        return res.status(400).json(new ApiError(400, "User already exists", "User already exists"));
    }
    
    const user = await User.create({
    username,
    email,
    password,
    isEmailVerified: false,
    role
   })

   const {unHashedToken,
    hashedToken,
    tokenExpiry} = user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationTokenExpiry = tokenExpiry;
    await user.save({ validateBeforeSave: false });

    // await sendMail({
    //     to: user?.email,
    //     subject: "Verify your email address",
    //     mailgenContent: emailVerificationMailgenContent(
    //         user?.username,
    //   `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHashedToken}`
    //     ),

    // });

    const createdUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry");
    
    if(!createdUser){
        throw new ApiError(500, "Failed to create user");
    }

  console.log("User registered successfully");
    return res.status(201).json(new ApiResponse(201, {user: createdUser}, "User registered successfully"));
  
    

   
});

const loginController = asyncHandler(async (req, res) => {

    console.log(req.body);
   
const {email, password,username} = req.body;
if(!username){
   return res.status(400).json(new ApiError(400, "username is required"));
}

console.log(email, password,username);

const user = await User.findOne({
    $or: [{username}]
});

if(!user){
 return res.status(404).json(new ApiError(404, "User not found"));
}



const isPasswordMatched = await user.comparePassword(password);

if(!isPasswordMatched){
   return res.status(400).json(new ApiError(400, "Invalid password"));
}

const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

const loggedInUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry");

const options = {
    httpOnly: true,
    secure: true,
    // sameSite: "strict",
    // maxAge: 7 * 24 * 60 * 60 * 1000
};



console.log("User logged in successfully");

res.status(200).cookie("accessToken", accessToken, options) 
.cookie("refreshToken", refreshToken, options)
.json(new ApiResponse(200, {user: loggedInUser,accessToken,refreshToken}, "User logged in successfully"));

})


const logOutUser = asyncHandler(async (req, res) => {
 await User.findByIdAndUpdate(
    req.user._id,
    {
$set:{
    refreshToken: null
}
 }, {new: true})

 const options = {
    httpOnly: true,
    secure: true,
};

return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));

})

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry");
    if(!user){
        return res.status(404).json(new ApiError(404, "User not found"));
    }
    return res.status(200).json(new ApiResponse(200, {user}, "User fetched successfully"));
})

const verifyEmail = asyncHandler(async (req, res) => {
    const {VerificationToken} = req.params;
    console.log("VerificationToken", VerificationToken);

    if(!VerificationToken){
        return res.status(400).json(new ApiError(400, "Email verification token is missing"));
    }




  let hashedToken = crypto
  .createHash("sha256")
  .update(VerificationToken)
  .digest("hex");



  const user = await User.findOne({emailVerificationToken: hashedToken,
    emailVerificationTokenExpiry: { $gt: Date.now() }
  });
    

    


  if(!user){
    return res.status(400).json(new ApiError(400, "Invalid verification token"));
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = null;
  user.emailVerificationTokenExpiry = null;
  await user.save({ validateBeforeSave: false });
    
  return res.status(200).json(new ApiResponse(200, {isEmailVerified: true}, "Email verified successfully"));
})

const resendEmailVerificationMail = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id);
    if(!user){
        return res.status(404).json(new ApiError(404, "User not found"));
    }
    if(user.isEmailVerified){
        return res.status(409).json(new ApiError(409, "Email already verified"));
    }
    const {unHashedToken,
        hashedToken,
        tokenExpiry} = user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationTokenExpiry = tokenExpiry;
    await user.save({ validateBeforeSave: false });

    await sendMail({
        to: user?.email,
        subject: "Verify your email address",
        mailgenContent: emailVerificationMailgenContent(
            user?.username,
      `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHashedToken}`
        ),

    });

    return res.status(200).json(new ApiResponse(200, {}, "Email verification mail sent successfully"));
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const {incomingRefreshToken} = req.cookies|| req.body.refreshToken;
    if(!incomingRefreshToken){
        return res.status(401).json(new ApiError(401, "Unauthorized request"));
    }

    try{
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?.id);
        if(!user){
            return res.status(401).json(new ApiError(401, "Invalid refresh token"));
        }

    if(user.refreshToken !== incomingRefreshToken){
        return res.status(401).json(new ApiError(401, "Refresh token expired"));
    }
    const options = {
        httpOnly: true,
        secure: true,
    };

    const {accessToken, NewRefreshToken} = await generateAccessAndRefreshToken(user._id);
    
    user.refreshToken = NewRefreshToken;
    await user.save({ validateBeforeSave: false });

    return res.status(200).cookie("accessToken", accessToken, options) 
    .cookie("refreshToken", NewRefreshToken, options)
    .json(new ApiResponse(200, {accessToken,NewRefreshToken}, "Access token refreshed successfully"));


    }catch(error){
        return res.status(500).json(new ApiError(500, "Failed to refresh access token"));
    }
})

const forgotPassword = asyncHandler(async (req, res) => {
    const {email} = req.body;
    if(!email){
        return res.status(400).json(new ApiError(400, "Email is required"));
    }
    const user = await User.findOne({email});
    if(!user){
        return res.status(404).json(new ApiError(404, "User not found"));
    }
    const {unHashedToken,
        hashedToken,
        tokenExpiry} = user.generateTemporaryToken();
    user.forgetPasswordToken = hashedToken;
    user.forgetPasswordTokenExpiry = tokenExpiry;
    await user.save({ validateBeforeSave: false });
    await sendMail({
        to: user?.email,
        subject: "Reset your password",
        mailgenContent: resetPasswordMailgenContent(
            user?.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/reset-password/${unHashedToken}`
        ),
    });
    return res.status(200).json(new ApiResponse(200, {}, "Password reset mail sent successfully"));
})

const resetForgotPassword = asyncHandler(async (req, res) => {
    const {resetToken} = req.params;
    const {newPassword} = req.body;
    if(!resetToken || !newPassword){
        return res.status(400).json(new ApiError(400, "Reset token and password are required"));
    }
    let hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
   
    const user = await User.findOne({forgetPasswordToken: hashedToken,
        forgetPasswordTokenExpiry: { $gt: Date.now() }
    });
    
    if(!user){
        return res.status(400).json(new ApiError(400, "Invalid reset token"));
    }
    user.password = newPassword;
    user.forgetPasswordToken = null;
    user.forgetPasswordTokenExpiry = null;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, {}, "Password reset successfully"));
})

const changePassword = asyncHandler(async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    if(!oldPassword || !newPassword){
        return res.status(400).json(new ApiError(400, "Old password and new password are required"));
    }
    const user = await User.findById(req.user._id);
    if(!user){
        return res.status(404).json(new ApiError(404, "User not found"));
    }
    const isPasswordMatched = await user.comparePassword(oldPassword);
    if(!isPasswordMatched){
        return res.status(400).json(new ApiError(400, "Invalid password"));
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
})


export {registerController,
     loginController,
     logOutUser, 
     getCurrentUser,
     verifyEmail,
     resendEmailVerificationMail,
     refreshAccessToken,
     forgotPassword,
     resetForgotPassword,
     changePassword
     }

