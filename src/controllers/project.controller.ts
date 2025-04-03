import projectService from "../services/project.service";
import { Request, Response, NextFunction } from "express";

class ProjectController {
  async addProject(req: Request, res: Response) {
    const data = req.body;
    res.send(await projectService.addProject(data));
  }

  async getProjects(req: Request, res: Response) {
    res.send(await projectService.getProjects());
  }

  async deleteProject(req: Request, res: Response) {
    const id = req.params.id;
    res.send(await projectService.deleteProject(id));
  }

  async getProject(req: Request, res: Response) {
    const id = req.params.id;
    res.send(await projectService.getProject(id));
  }
}
const projectController = new ProjectController();
export default projectController;
