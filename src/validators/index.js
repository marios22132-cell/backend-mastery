import {body} from "express-validator";
import { AvailableUserRoles } from "../utils/constants";


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

const userChangeCurrentPasswordValidator = ()=>{
    return [
        body("currentPassword")
        .trim()
        .notEmpty()
        .withMessage("Current password is required"),
        body("newPassword")
        .trim()
        .notEmpty()
        .withMessage("New password is required")
        .isLength({min: 6, max: 100})
        .withMessage("New password must be between 6 and 100 characters")
    ] 
}

const forgotPasswordValidator = ()=>{
    return [
        body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format")
    ]
}

const createProjectValidator = ()=>{
    return [
        body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
    ]

}

const addMemberToProjectValidator = ()=>{
    return [
        body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is reqired")
        .isEmail()
        .withMessage("Invalid email format"),
        body("role")
        .trim()
        .notEmpty()
        .withMessage("Role is required")
        .isIn(AvailableUserRoles)
        .withMessage("Invalid role")
    ]}


export{
    registerUserValidator, 
    userChangeCurrentPasswordValidator,
    forgotPasswordValidator,
    createProjectValidator,
    addMemberToProjectValidator,
    loginValidator
}
