"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const project_service_1 = __importDefault(require("../services/project.service"));
class ProjectController {
    async addProject(req, res) {
        const data = req.body;
        res.send(await project_service_1.default.addProject(data));
    }
    async getProjects(req, res) {
        res.send(await project_service_1.default.getProjects());
    }
    async deleteProject(req, res) {
        const id = req.params.id;
        res.send(await project_service_1.default.deleteProject(id));
    }
    async getProject(req, res) {
        const id = req.params.id;
        res.send(await project_service_1.default.getProject(id));
    }
}
const projectController = new ProjectController();
exports.default = projectController;
