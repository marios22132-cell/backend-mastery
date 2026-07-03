import { Router } from "express";
import {login, registerUser, logout, verifyEmail, refreshAccessToken} from "../controllers/auth.controller.js";
import {validateRequest} from "../middlewares/validator.middlewares.js";
import {
addMemberToProjectValidator,
createProjectValidator
}from "../validators/index.js";
import {verifyJWT, verifyProjectMember} from "../controllers/auth.controller.js";
import { get } from "express/lib/response.js";

const router = Router();
router.use(verifyJWT)

router
.route("/:projectId")
.get()
.post(createProjectValidator(), validateRequest, createProject)

export default router;