"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_response_1 = require("../core/error.response");
const success_response_1 = require("../core/success.response");
const project_model_1 = __importDefault(require("../models/project.model"));
class ProjectService {
    async addProject(data) {
        const dataProject = await project_model_1.default.insertMany(data);
        if (!dataProject) {
            throw new error_response_1.BadRequestError("Error creating project");
        }
        return new success_response_1.CreatedResponse("Project created", dataProject);
    }
    async getProjects() {
        const dataProject = await project_model_1.default.find();
        if (!dataProject) {
            throw new error_response_1.BadRequestError("Error getting projects");
        }
        return new success_response_1.OkResponse("Projects found", dataProject);
    }
    async deleteProject(id) {
        const data = await project_model_1.default.findByIdAndDelete(id);
        if (!data) {
            throw new error_response_1.BadRequestError("Project not found");
        }
        return new success_response_1.OkResponse("Project deleted", data);
    }
    async getProject(id) {
        const data = await project_model_1.default.findById(id);
        if (!data) {
            throw new error_response_1.BadRequestError("Project not found");
        }
        return new success_response_1.OkResponse("Project found", data);
    }
}
const projectService = new ProjectService();
exports.default = projectService;
