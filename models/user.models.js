import mongoose, { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();
const userSchema = new Schema({
  username:{
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  email:{
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  password:{
    type: String,
    required: true,
   
  },
  role:{
    type: String,
    trim: true,
    lowercase: true,
    default: "user",
  
  },
isEmailVerified:{
    type: Boolean,
    default: false
},
refreshToken:{
    type: String,
    default: null
},
forgetPasswordToken:{
    type: String,
    default: null
},
forgetPasswordTokenExpiry:{
    type: Date,
    default: null
},
emailVerificationToken:{
    type: String,
    default: null
},
emailVerificationTokenExpiry:{
    type: Date,
    default: null
},

});
    
// hash password
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// compare password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}


// generate access token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { id: this._id,
        email: this.email,
        username: this.username,
    
        }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRY,
    });
}

// generate refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { id: this._id },
    process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRY,
    });
}

// generate temporary token
userSchema.methods.generateTemporaryToken = function () {
    const unHashedToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(unHashedToken).digest("hex");
  const tokenExpiry = Date.now() + 60 * 60 * 1000;

  return {
    unHashedToken,
    hashedToken,
    tokenExpiry
  };
}


export const User = model("User", userSchema);