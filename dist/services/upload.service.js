"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const success_response_1 = require("../core/success.response");
const storage_1 = __importDefault(require("../storage/storage"));
class UploadService {
    async uploadImage(file) {
        await storage_1.default.uploader.upload(file, (error, result) => {
            if (error) {
                throw new Error("Error uploading image");
            }
            return new success_response_1.CreatedResponse("Image uploaded", result);
        });
    }
}
const uploadService = new UploadService();
exports.default = uploadService;
