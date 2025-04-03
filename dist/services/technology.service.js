"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_response_1 = require("../core/error.response");
const success_response_1 = require("../core/success.response");
const technology_model_1 = __importDefault(require("../models/technology.model"));
class TechnologyService {
    async getTechnologies() {
        const data = await technology_model_1.default.find();
        if (!data) {
            throw new error_response_1.BadRequestError("Error getting technologies");
        }
        return new success_response_1.OkResponse("Technologies found", data);
    }
    async addTechnologies(payload) {
        const data = payload;
        const response = await technology_model_1.default.create(data);
        if (!response) {
            throw new error_response_1.BadRequestError("Error adding technologies");
        }
        return new success_response_1.OkResponse("Technologies added", response);
    }
}
const technologyService = new TechnologyService();
exports.default = technologyService;
