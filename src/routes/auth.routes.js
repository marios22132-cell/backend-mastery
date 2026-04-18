import { Router } from "express";
import {registerUser} from "../controllers/auth.controller.js";
import {validateRequest} from "../middlewares/validator.middlewares.js";
import {registerUserValidator} from "../validators/index.js";
const router = Router();

router.post("/register",registerUserValidator(), validateRequest,registerUser);
export default router;