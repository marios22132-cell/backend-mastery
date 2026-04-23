import { Router } from "express";
import {login, registerUser, logout} from "../controllers/auth.controller.js";
import {validateRequest} from "../middlewares/validator.middlewares.js";
import {registerUserValidator, loginValidator} from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/register",registerUserValidator(), validateRequest,registerUser);
router.post("/login", loginValidator(), validateRequest, login);
router.post("/logout", verifyJWT,logout);


export default router;