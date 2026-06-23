import { Project } from "../models/projects.model.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiRequest } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-Handler.js";
import mongoose from "mongoose";
import { ProjectMember } from "../models/projectMember.model.js";
import { UserRolesEnum } from "../utils/constants.js";
import { pipeline } from "nodemailer/lib/xoauth2/index.js";


const getProjects = asyncHandler(async (req, res) => {
    //test
});

const addMemberToProject = asyncHandler(async (req, res) => {
    //test
});

const deleteProject = asyncHandler(async (req, res) => {
    const {projectId} = req.body

    const project = await Project.findByIdAndDelete (projectId)

    if (!project){
        throw new ApiError (404,"Project not find")
    }
    return res
    .status(200)
    .json(new ApiRequest(200, project, "Project delete successfully")); 

});

const updateProject = asyncHandler(async (req, res) => {
    const {name, description} = req.body;
    const projectId = req.params.projectId;

    const project = await Project.findById(projectId,{
        name,
        description
    },{new: true});
    if(!project){
        throw new ApiError(404, "Project not found");
    }
    return res
    .status(200)
    .json(new ApiRequest(200, project, "Project updated successfully"));

});

const getProjectMembers = asyncHandler(async (req, res) => {
    const project = await Project.aggrigate([{
        
    },
    {
        $match:
        {
            user: new mongoose.Types.ObjectId(req.user._id)
        },
        $lookup: {
            from: "projectmembers",
            localField: "_id",
            foreignField: "project",
            as: "projects",
            pipeline:[
                { $lookup: {
                    from: "projectMembers",
                    localField: "_id",
                    foreignField: "project",
                    as: "projectmembers"
                },
                $addFields: {
                    members:{
                        $size: "$projectmembers"
                    }
                }
            },
            {$unwind: "$projectmembers",},
            { $project: {
                _id: 1,
                name: 1,
                description:1,
                members:1,
                createdAt: 1,
                createdBy: 1,
            },
            role:1,
            _id: 0

           }

            ],
        }
    }])    
    return res
    .status(200)
    .json(new ApiRequest(200, project, "Project members fetched successfully"));
});

const deleteMemberFromProject = asyncHandler(async (req, res) => {
 //tesst 
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