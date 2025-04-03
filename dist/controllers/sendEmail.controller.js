"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sendEmail_service_1 = __importDefault(require("../services/sendEmail.service"));
class EmailController {
    async sendEmail(req, res) {
        const { name, email, message } = req.body;
        return res.send(sendEmail_service_1.default.sendEmail({ name, email, message }));
    }
}
const emailController = new EmailController();
exports.default = emailController;
