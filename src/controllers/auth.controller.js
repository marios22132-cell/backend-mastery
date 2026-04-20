import {User} from "../models/user.model.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiRequest } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-Handler.js";
import { sendEmail, mailGen } from "../utils/mail.js";


const generateAccessTokkenAndRefreshToken = (userId) => {
    try{
        const user = User.findById(userId);
        const accessTokken =user.generateJWT();
        const refreshTokken = user.generateRefreshToken();

        user.refreshToken = refreshTokken;
        user.save({validateBeforeSave: false});

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



export {registerUser, login}