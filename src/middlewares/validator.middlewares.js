import { validationResult } from "express-validator";
import ApiError from "../utils/apiError.js";

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
    throw new ApiError(422, "Validation failed", extractedErrors);
}

export default validateRequest;