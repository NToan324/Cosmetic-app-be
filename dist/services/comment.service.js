"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const error_response_1 = require("../core/error.response");
const success_response_1 = require("../core/success.response");
const comment_model_1 = __importDefault(require("../models/comment.model"));
const storage_1 = __importDefault(require("../storage/storage"));
const socket_instance_1 = __importDefault(require("./socket.instance"));
class CommentService {
    async getComments() {
        const response = await comment_model_1.default.find().sort({ date: -1 });
        if (!response) {
            throw new error_response_1.BadRequestError("Error getting comments");
        }
        return new success_response_1.OkResponse("Comments found", response);
    }
    async addComment({ name, message, urlImage, }) {
        let resultImage = "";
        if (urlImage && urlImage !== "") {
            const uploadedImage = await storage_1.default.uploader.upload(urlImage, {
                transformation: {
                    width: 100,
                    height: 100,
                    crop: "fill",
                },
            });
            resultImage = uploadedImage?.secure_url ?? "";
        }
        const response = await comment_model_1.default.create({
            name,
            message,
            urlImage: resultImage,
        });
        if (!response) {
            throw new error_response_1.BadRequestError("Error adding comment");
        }
        socket_instance_1.default.getIO().emit(constants_1.SOCKET_ACTION.GET_COMMENTS, response);
        return new success_response_1.OkResponse("Comment added", response);
    }
    async deleteComments() {
        const response = await comment_model_1.default.deleteMany();
        if (!response) {
            throw new error_response_1.BadRequestError("Error deleting comments");
        }
        return new success_response_1.OkResponse("Comments deleted", response);
    }
}
const commentService = new CommentService();
exports.default = commentService;
