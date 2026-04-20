import {body} from "express-validator";



const registerUserValidator = ()=>{
    return [
        body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
        body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLowercase()
        .withMessage("Username must be in lowercase")
        .isLength({min: 3, max: 30})
        .withMessage("Username must be between 3 and 30 characters"),
        body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({min: 6, max: 100})
        .withMessage("Password must be between 6 and 100 characters"),
        body("userName")
        .optional()
        .trim()
        .isLength({min: 3, max: 30})
        .withMessage("User name must be between 3 and 30 characters")

    ]
        

}

const loginValidator = ()=>{
    return [
        body("email")
        .optional()
        .trim()
        .isEmail()
        .withMessage("Invalid email format"),
        body("username")
        .optional()
        .trim()
        .isLowercase()
        .withMessage("Username must be in lowercase")
        .isLength({min: 3, max: 30})
        .withMessage("Username must be between 3 and 30 characters"),
        body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
    ]
}


export{
    registerUserValidator, loginValidator
}
