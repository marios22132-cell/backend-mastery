import { User } from "../models/user.model";
import { ApiError } from "../utils/api-errors.js";
import { ApiRequest } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-Handler.js";
import jwt from "jsonwebtoken";


export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessTokken || req.headers?.authorization?.replace("Bearer ", "");
    if (!token) {
        throw new ApiError(401, "Unauthorized", []);
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?.id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry");
        if (!user) {
            throw new ApiError(401, "User not found", []);
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid access token");
    }
});