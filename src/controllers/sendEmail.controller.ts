import emailService from "../services/sendEmail.service";
import { Request, Response, NextFunction } from "express";
export interface Email {
  name: string;
  email: string;
  message: string;
}

class EmailController {
  async sendEmail(req: Request, res: Response) {
    const { name, email, message } = req.body;
    return res.send(emailService.sendEmail({ name, email, message }));
  }
}

const emailController = new EmailController();
export default emailController;
