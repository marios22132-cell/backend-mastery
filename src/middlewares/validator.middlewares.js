import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-errors.js";

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
   return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors: errors.array()
    });
}

export  {validateRequest};