"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailConfig {
    transporter = nodemailer_1.default.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "nhattoan664t@gmail.com",
            pass: "nlsz yhey yrlp dhjt",
        },
    });
    mailOptions = ({ name, email, message }) => {
        return {
            from: "nhattoan664t@gmail.com",
            to: "nhattoan664t@gmail.com",
            subject: "📩 New Message from Portfolio Contact Form",
            replyTo: email,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="color: #333; text-align: center;">📩 New Contact Message</h2>
          <p style="color: #555; text-align: center;">You have received a new message from your portfolio contact form.</p>
          <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;" />
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #333;">Name:</td>
              <td style="padding: 8px; color: #555;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #333;">Email:</td>
              <td style="padding: 8px; color: #555;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #333;">Message:</td>
              <td style="padding: 8px; color: #555;">${message}</td>
            </tr>
          </table>
          <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;" />
          <p style="color: #777; font-size: 12px; text-align: center;">
            ⚡ This email was sent automatically from your portfolio website.
          </p>
        </div>
      `,
        };
    };
}
const emailConfig = new EmailConfig();
exports.default = emailConfig;
