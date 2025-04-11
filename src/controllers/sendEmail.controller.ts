import emailService from '@/services/sendEmail.service'
import { Request, Response } from 'express'

class EmailController {
  async sendEmail(req: Request, res: Response) {
    const { email, otpCode } = req.body
    return res.send(emailService.sendEmail({ email, otpCode }))
  }
}

const emailController = new EmailController()
export default emailController
