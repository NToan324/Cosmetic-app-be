"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const technology_service_1 = __importDefault(require("../services/technology.service"));
class TechnologyController {
    async getTechnologies(req, res) {
        res.send(await technology_service_1.default.getTechnologies());
    }
    async addTechnologies(req, res) {
        const techonologyData = req.body;
        res.send(await technology_service_1.default.addTechnologies(techonologyData));
    }
}
const technologyController = new TechnologyController();
exports.default = technologyController;
