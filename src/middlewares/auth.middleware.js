import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiRequest } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-Handler.js";
import jwt from "jsonwebtoken";
import { ProjectMember } from "../models/projectMember.model.js";
import { UserRolesEnum } from "../utils/constants.js";

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

export const verifyProjectMember = (role = []) => {
    asyncHandler(async (req, res, next) => {
        const {projectId} = req.params;

        if (!projectId){
            throw new ApiError(400, "Project id is required", []);
        }
        const project = await ProjectMember.findOne({
            user: new mongoose.Types.ObjectId(req.user._id),
            project: new mongoose.Types.ObjectId(projectId)

        });

            if (!project) {
                throw new ApiError(404, "Project not found", []);
            }
            const giveRole = project?.role;

            req.user.role = giveRole;
            
            if (!role.includes(giveRole)){
                throw new ApiError (403, "You are not authorized to perform this action") 
            }
             
            next();
    
    })
}