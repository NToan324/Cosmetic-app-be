import TechnologyService from "../services/technology.service";
import { Request, RequestHandler, Response } from "express";

class TechnologyController {
  async getTechnologies(req: Request, res: Response) {
    res.send(await TechnologyService.getTechnologies());
  }

  async addTechnologies(req: Request, res: Response) {
    const techonologyData = req.body;
    res.send(await TechnologyService.addTechnologies(techonologyData));
  }
}

const technologyController = new TechnologyController();
export default technologyController;
