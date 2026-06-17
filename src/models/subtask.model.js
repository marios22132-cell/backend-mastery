import  Mongoose, { Schema }  from "mongoose";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js";

const subtaskSchema = new Schema ({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    task: {
        type: Schema.Types.ObjectId,
        ref: "Task",
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

},{timestamps: true})

export const Subtask = Mongoose.model("Subtask", subtaskSchema);
