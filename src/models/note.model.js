import  Mongoose, { Schema }  from "mongoose";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js";

const projectNoteSchema = new Schema({
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    note: {
        type: String,
        required: true,
        trim: true 
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    }
},{timestamps: true})

export const ProjectNote = Mongoose.model("ProjectNote", projectNoteSchema);