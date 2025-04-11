import emailConfig from '@/config/email'
import { Email } from '@/config/email'
import { BadRequestError } from '../core/error.response'
import { OkResponse } from '../core/success.response'

class EmailService {
  async sendEmail({ email, otpCode }: Email) {
    const mailOptions = emailConfig.mailOptions({ email, otpCode })
    emailConfig.transporter.sendMail(mailOptions, (error: Error | null, info: { response: string }) => {
      if (error) {
        throw new BadRequestError('Error sending email')
      } else {
        return new OkResponse('Email sent', info.response)
      }
    })
  }
}

const emailService = new EmailService()
export default emailService
