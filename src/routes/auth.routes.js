import { Router } from "express";
import {login, registerUser, logout, verifyEmail, refreshAccessToken} from "../controllers/auth.controller.js";
import {validateRequest} from "../middlewares/validator.middlewares.js";
import {
registerUserValidator,
loginValidator,
forgotPasswordValidator,
resetPasswordValidator,
userChangeCurrentPasswordValidator}
 from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
//unsecured
router.post("/register",registerUserValidator(), validateRequest,registerUser);
router.post("/login", loginValidator(), validateRequest, login);
router
.route("/verify-email/:verificationToken").get(verifyEmail)

router.route("/refresh-token").post(refreshAccessToken);
router.route("/forgot-password").post(forgotPasswordValidator(), validateRequest, forgotPassword);

router.route("/reset-password/:resetToken").post(resetPasswordValidator(), validateRequest, resetPassword)
//secured route for logout, only accessible to authenticated users
router.post("/logout", verifyJWT,logout);
router.route("/curent-user").get(verifyJWT, getCurrentUser);
router.route("/change-password").post(verifyJWT, userChangeCurrentPasswordValidator(), validateRequest, changeCurrentPassword);
router.route("/resend-verification-email").post(verifyJWT, resendVerificationEmail);

export default router;