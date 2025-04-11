import nodemailer from 'nodemailer'

export interface Email {
  email: string
  otpCode: string
}

class EmailConfig {
  transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'nhattoan664t@gmail.com',
      pass: process.env.MAILER_PASSWORD
    }
  })

  // Gửi mã OTP xác thực tài khoản
  mailOptions = ({ email, otpCode }: Email) => {
    return {
      from: 'nhattoan664t@gmail.com',
      to: email,
      subject: '🔐 Mã xác thực tài khoản (OTP)',
      replyTo: 'nhattoan664t@gmail.com',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="color: #333; text-align: center;">🔐 Xác thực Email</h2>
          <p style="color: #555; text-align: center;">Mã OTP của bạn là:</p>
          <div style="font-size: 32px; font-weight: bold; text-align: center; color: #ff5722; margin: 20px 0;">
            ${otpCode}
          </div>
          <p style="color: #777; text-align: center;">
            Mã này sẽ hết hạn sau 5 phút. Vui lòng không chia sẻ cho bất kỳ ai.
          </p>
          <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;" />
          <p style="color: #aaa; font-size: 12px; text-align: center;">
            ⚡ Đây là email tự động. Vui lòng không trả lời lại.
          </p>
        </div>
      `
    }
  }

  // Gửi thông báo tài khoản nhân viên được tạo thành công
  createAccountMailOptions = ({
    email,
    name,
    password
  }: {
    email: string
    name: string
    password: string
  }) => {
    return {
      from: 'nhattoan664t@gmail.com',
      to: email,
      subject: '🎉 Tài khoản của bạn đã được tạo thành công!',
      replyTo: 'nhattoan664t@gmail.com',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f4f6f8;">
          <h2 style="color: #4caf50; text-align: center;">🎉 Chào mừng ${name}!</h2>
          <p style="color: #333;">Tài khoản nhân viên của bạn đã được tạo thành công. Dưới đây là thông tin đăng nhập:</p>
          
          <ul style="list-style: none; padding: 0; color: #555;">
            <li><strong>👤 Tên đăng nhập:</strong> ${email}</li>
            <li><strong>🔑 Mật khẩu:</strong> ${password}</li>
          </ul>

          <p style="color: #f44336;"><strong>Lưu ý:</strong> Bạn cần xác thực tài khoản khi đăng nhập lần đầu tiên.</p>
          
          <p style="color: #777; margin-top: 20px;">Nếu bạn không yêu cầu tạo tài khoản này, vui lòng liên hệ quản lý ngay lập tức.</p>

          <hr style="border: none; height: 1px; background: #ccc; margin: 20px 0;" />
          <p style="color: #aaa; font-size: 12px; text-align: center;">
            📧 Email này được gửi tự động. Vui lòng không trả lời lại.
          </p>
        </div>
      `
    }
  }
}

const emailConfig = new EmailConfig()

export default emailConfig
