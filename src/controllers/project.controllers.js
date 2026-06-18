import { Project } from "../models/projects.model.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiRequest } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-Handler.js";
import mongoose from "mongoose";
import { ProjectMember } from "../models/projectMember.model.js";
import { UserRolesEnum } from "../utils/constants.js";
}

const getProjects = asyncHandler(async (req, res) => {
    //test
});

const addMemberToProject = asyncHandler(async (req, res) => {
    //test
});

const deleteProject = asyncHandler(async (req, res) => {
    //test

});

const updateProject = asyncHandler(async (req, res) => {
    //test
});

const getProjectMembers = asyncHandler(async (req, res) => {
    //test
});

const deleteMemberFromProject = asyncHandler(async (req, res) => {
    //test

});

const createProject = asyncHandler(async (req, res) => {
    const {name, description} = req.body;

    const project = await Project.create({
        name,
        description,
        createdBy: new mongoose.Types.ObjectId(req.user._id)
    });
    await ProjectMember.create({
        user: new mongoose.Types.ObjectId(req.user._id),
        project: new mongoose.Types.ObjectId(project._id),
        role: UserRolesEnum.ADMIN
        });
return res
.status(201)
.json(new ApiRequest(201, project, "Project created successfully"));
})


export {
    getProjects,
    addMemberToProject,
    deleteProject,
    updateProject,
    getProjectMembers,
    deleteMemberFromProject,
    createProject


}