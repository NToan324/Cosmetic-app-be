import emailConfig from "../config/email";
import { Email } from "../controllers/sendEmail.controller";
import { BadRequestError } from "../core/error.response";
import { OkResponse } from "../core/success.response";

class EmailService {
  async sendEmail({ name, email, message }: Email) {
    const mailOptions = emailConfig.mailOptions({ name, email, message });
    emailConfig.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        throw new BadRequestError("Error sending email");
      } else {
        return new OkResponse("Email sent", info.response);
      }
    });
  }
}

const emailService = new EmailService();
export default emailService;
