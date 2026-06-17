import  Mongoose, { Schema }  from "mongoose";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js";

const taskSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["TODO", "IN_PROGRESS", "DONE"],
        default: "TODO"
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assignedby: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }, 
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    }, 
    


},{timestamps: true})

export const Task = Mongoose.model("Task", taskSchema);