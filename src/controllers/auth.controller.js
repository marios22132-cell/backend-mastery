
import {User} from "../models/user.model.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiRequest } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-Handler.js";
import { sendEmail, mailGen } from "../utils/mail.js";
import jwt from "jsonwebtoken";


const generateAccessTokkenAndRefreshToken = async (userId) => {
    try{
        const user = await User.findById(userId);
        const accessTokken =user.generateJWT();
        const refreshTokken = user.generateRefreshToken();

        user.refreshToken = refreshTokken;
        await user.save({validateBeforeSave: false});

        return {accessTokken, refreshTokken};
    }catch(error){
        throw new ApiError(500, "Error while generating access and refresh tokens", [error.message]);
    }
}

const registerUser = asyncHandler(async (req, res) => {
const {username, email, password} = req.body;


const existingUser = await User.findOne({email});
if(existingUser){ 
    throw new ApiError(409, "User with this email already exists", []);
}

const user = await User.create(
    {
    username, 
    email, 
    password,
    isEmailVerified: false
})
    const {unhashedToken, hashedToken, expiry} = user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = expiry;
    await user.save({validateBeforeSave: false});

    await sendEmail({
        to: user?.email,
        subject: "Email Verification",
        mailgenContent: mailGen(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}`
        ),
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry");
    if(!createdUser){
        throw new ApiError(500, "Error while creating user", []);
    }
    
   return res.status(201).json(
    new ApiRequest(true, "User registered successfully...", createdUser)
);
})

const login = asyncHandler(async (req, res) => {
const {email, password, username} = req.body;
if (!email) {
    throw new ApiError(400, "Email or username is required", []);   
}
const user = await User.findOne({email});
if (!user) {
    throw new ApiError(404, "User not found", []);
}
const isPasswordValid = await user.comparePassword(password);
if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password", []);
}
const {accessTokken, refreshTokken} = await generateAccessTokkenAndRefreshToken(user._id);
const loggedInUser = await User.findById(user._id).select ("-password -refreshToken -emailVerificationToken -emailVerificationExpiry");

const cookieOptions = {
    httpOnly: true,
    secure: true
};
return res
.status(200)
.cookie("refreshToken", refreshTokken, cookieOptions)
.cookie("accessToken", accessTokken, cookieOptions)
.json(new ApiRequest(
    200,
    {user: loggedInUser, 
    accessTokken, 
    refreshTokken
    },
    "User logged in successfully"
));
})

const logout = asyncHandler(async (req, res) => {
await User.findByIdAndUpdate(req.user._id, 
    {
        refreshToken: ""

    }, 
    {
        new: true
    });
    const options = {
        httpOnly: true,
        secure: true,
        
    }
    return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new ApiRequest(200, null, "User logged out successfully"));

})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json(new ApiRequest(200, req.user, "Current user fetched successfully"));
})

const verifyEmail = asyncHandler(async (req, res) => {
    const {verificationToken} = req.params;
    if (!verificationToken) {
        throw new ApiError(400, "Verification token is required", []);
    }

    let hashedToken= crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

   const user = await User.findOne({emailVerificationToken: hashedToken, emailVerificationExpiry: {$gt: Date.now()}})
   if (!user){
    throw new ApiError(400, "Invalid verification token", []);
   }
   user.emailVerificationToken = undefined;
   user.emailVerificationExpiry = undefined;

   user.isEmailVerified = true;
   await user.save({validateBeforeSave: false});

   return res
   .status(200)
   .json(new ApiRequest(200, null, "Email verified successfully"));
})

const resendEmailVerification = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id);
    if (user.isEmailVerified) {
        throw new ApiError(400, "Email is already verified",);
    }
    if (user.isEmailVerified) {
        throw new ApiError(409, "Email is already verified",);
    }

    const {unhashedToken, hashedToken, expiry} = user.generateTemporaryToken();
    
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = expiry;
    await user.save({validateBeforeSave: false});

    await sendEmail({
        to: user?.email,
        subject: "Email Verification",
        mailgenContent: mailGen(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}`
        ),
    });
    return res
    .status(200)
    .json(new ApiRequest(200, null, "Verification email resent successfully"));


})

const refreshAccessToken = asyncHandler(async (req, res) => {
   const incomingTokken = req.uest.cookies.refreshToken || req.body.refreshToken;

   if (!incomingTokken) {
    throw new ApiError(401, "Refresh token is required",);
   }
   try{
    const decoded = jwt.verify(incomingTokken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded?._id);

    if (!user || user.refreshToken !== incomingTokken) {
        throw new ApiError(401, "Invalid refresh token",);
    }
    if(incomingTokken !== user?.refreshToken){
        throw new ApiError(401, "Invalid refresh token",);
    }

    const options = {
        httpOnly: true,
        secure: true,
    }
    const {accessTokken, refreshTokken: newRefreshTokken} = await generateAccessTokkenAndRefreshToken(user._id);
    user.refreshToken = newRefreshTokken;
    await user.save({validateBeforeSave: false});
    return res
    .status(200)
    .cookie("refreshToken", newRefreshTokken, options)
    .cookie("accessToken", accessTokken, options)
    .json(new ApiRequest(200, null, "Access token refreshed successfully"));

    
   }catch(error){
    throw new ApiError(401, "Invalid refresh token",);
   }


})


export {registerUser, login, logout, getCurrentUser, verifyEmail, resendEmailVerification, refreshAccessToken};