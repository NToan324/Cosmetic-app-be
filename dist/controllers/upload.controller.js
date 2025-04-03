"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const upload_service_1 = __importDefault(require("../services/upload.service"));
class UploadController {
    async uploadImage(req, res) {
        const { image } = req.body;
        return res.send(await upload_service_1.default.uploadImage(image));
    }
}
const uploadController = new UploadController();
exports.default = uploadController;
