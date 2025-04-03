"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const comment_service_1 = __importDefault(require("../services/comment.service"));
class CommentController {
    async getComments(req, res) {
        res.send(await comment_service_1.default.getComments());
    }
    async addComment(req, res) {
        const { name, message, urlImage } = req.body;
        res.send(await comment_service_1.default.addComment({ name, message, urlImage }));
    }
    async deleteComments(req, res) {
        res.send(await comment_service_1.default.deleteComments());
    }
}
const commentController = new CommentController();
exports.default = commentController;
