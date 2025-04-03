import { BadRequestError } from "../core/error.response";
import { CreatedResponse, OkResponse } from "../core/success.response";
import ProjectModel, { Project } from "../models/project.model";
class ProjectService {
  async addProject(data: Project) {
    const dataProject = await ProjectModel.insertMany(data);
    if (!dataProject) {
      throw new BadRequestError("Error creating project");
    }
    return new CreatedResponse("Project created", dataProject);
  }
  async getProjects() {
    const dataProject = await ProjectModel.find();
    if (!dataProject) {
      throw new BadRequestError("Error getting projects");
    }
    return new OkResponse("Projects found", dataProject);
  }
  async deleteProject(id: string) {
    const data = await ProjectModel.findByIdAndDelete(id);
    if (!data) {
      throw new BadRequestError("Project not found");
    }
    return new OkResponse("Project deleted", data);
  }

  async getProject(id: string) {
    const data = await ProjectModel.findById(id);
    if (!data) {
      throw new BadRequestError("Project not found");
    }
    return new OkResponse("Project found", data);
  }
}

const projectService = new ProjectService();

export default projectService;
