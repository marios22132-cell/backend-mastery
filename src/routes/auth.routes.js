import { Router } from "express";
import {login, registerUser} from "../controllers/auth.controller.js";
import {validateRequest} from "../middlewares/validator.middlewares.js";
import {registerUserValidator, loginValidator} from "../validators/index.js";
const router = Router();

router.post("/register",registerUserValidator(), validateRequest,registerUser);
router.post("/login", loginValidator(), validateRequest, login);
export default router;