import { BadRequestError } from "../core/error.response";
import { OkResponse } from "../core/success.response";
import TechnologyModel, { Technology } from "../models/technology.model";

class TechnologyService {
  async getTechnologies() {
    const data = await TechnologyModel.find();
    if (!data) {
      throw new BadRequestError("Error getting technologies");
    }
    return new OkResponse("Technologies found", data);
  }

  async addTechnologies(payload: Array<Technology>) {
    const data = payload;
    const response = await TechnologyModel.create(data);
    if (!response) {
      throw new BadRequestError("Error adding technologies");
    }
    return new OkResponse("Technologies added", response);
  }
}

const technologyService = new TechnologyService();
export default technologyService;
