"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const email_1 = __importDefault(require("../config/email"));
const error_response_1 = require("../core/error.response");
const success_response_1 = require("../core/success.response");
class EmailService {
    async sendEmail({ name, email, message }) {
        const mailOptions = email_1.default.mailOptions({ name, email, message });
        email_1.default.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                throw new error_response_1.BadRequestError("Error sending email");
            }
            else {
                return new success_response_1.OkResponse("Email sent", info.response);
            }
        });
    }
}
const emailService = new EmailService();
exports.default = emailService;
