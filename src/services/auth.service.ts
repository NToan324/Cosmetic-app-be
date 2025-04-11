import { BadRequestError, ForbiddenError } from '@/core/error.response'
import { CreatedResponse, OkResponse } from '@/core/success.response'
import userModel from '@/models/user.model'
import customerModel, { Customer } from '@/models/customer.model'
import employeeModel from '@/models/employee.model'
import otpModel from '@/models/otp.model'
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'
import emailConfig from '@/config/email'
dotenv.config()
class AuthService {
  async signup(payload: { phone: string; name: string }) {
    const password = '123456'
    const { phone, name } = payload
    const isPhoneNumberExist = await userModel.exists({ phone })

    if (isPhoneNumberExist) {
      throw new BadRequestError('Phone number already exists')
    }

    const newUser = await userModel.create({
      name,
      phone,
      password,
      role: ['CUSTOMER']
    })

    const newCustomer = (await customerModel.create({
      userId: newUser._id,
      rank: 'MEMBER'
    })) as Customer

    const userResponse = {
      id: newUser._id,
      phone: newUser.phone,
      name: newUser.name,
      role: newUser.role,
      rank: newCustomer.rank,
      point: newCustomer.point
    }

    return new CreatedResponse('User created successfully', userResponse)
  }

  async login(data: { email: string; phone: string; password: string }) {
    const { email, phone, password } = data
    const foundUser = await userModel.findOne(email ? { email } : { phone })
    if (!foundUser) {
      throw new BadRequestError('User not found')
    }
    if (phone && !email) {
      const isCustomer = await customerModel.findOne({ userId: foundUser._id })
      if (!isCustomer) {
        throw new BadRequestError('Customer not found')
      }
    } else if (email) {
      const isEmployee = await employeeModel.findOne({ userId: foundUser._id })
      if (!isEmployee) {
        throw new BadRequestError('Employee not found')
      }
    }
    const isPasswordMatch = await bcrypt.compare(password, foundUser.password)
    if (!isPasswordMatch) {
      throw new BadRequestError('Password is incorrect')
    }
    //check if user is active
    if (!foundUser.active) {
      throw new ForbiddenError('UnverifiedAccount')
    }
    const accessToken = jwt.sign(
      {
        id: foundUser._id,
        phone: foundUser.phone || undefined,
        email: foundUser.email || undefined,
        role: foundUser.role
      },
      process.env.ACCESS_TOKEN_SECRETE as string,
      {
        expiresIn: '1h'
      }
    )
    const refreshToken = jwt.sign(
      {
        id: foundUser._id,
        phone: foundUser.phone || undefined,
        email: foundUser.email || undefined,
        role: foundUser.role
      },
      process.env.REFRESH_TOKEN_SECRETE as string,
      {
        expiresIn: '1d'
      }
    )

    const customer = await customerModel.findOne({ userId: foundUser._id })
    let rank
    let point
    if (customer) {
      rank = customer.rank
      point = customer.point
    }

    const user = {
      id: foundUser._id,
      phone: foundUser.phone,
      name: foundUser.name,
      role: foundUser.role,
      rank: rank,
      point: point
    }
    return { accessToken, refreshToken, user }
  }

  async deleteUser(id: string) {
    const user = await userModel.findByIdAndDelete(id)
    if (!user) {
      throw new BadRequestError('User not found')
    }
    return new OkResponse('User deleted successfully', user)
  }

  async getUser(id: string) {
    const users = await userModel.findOne({ _id: id })
    return new OkResponse('Get all users successfully', users)
  }

  async getMe(payload: { phone?: string; email?: string }) {
    const { phone, email } = payload
    const user = await userModel.findOne({ $or: [{ phone }, { email }] })
    if (!user) {
      throw new BadRequestError('User not found')
    }
    const customer = await customerModel.findOne({ userId: user._id })
    let rank
    let point
    if (customer) {
      rank = customer.rank
      point = customer.point
    }
    const userResponse = {
      id: user._id,
      phone: user.phone,
      name: user.name,
      role: user.role,
      rank: rank,
      point: point
    }
    return new OkResponse('Get user successfully', userResponse)
  }

  async getUserByPhoneOrEmail({ phone, email }: { phone?: string; email?: string }) {
    if (!phone && !email) {
      throw new BadRequestError('Phone or email is required')
    }
    const user = await userModel.findOne({ $or: [{ phone }, { email }] }).select('-password')
    if (!user) {
      throw new BadRequestError('The account has not been registered')
    }
    return new OkResponse('Found user successfully', user)
  }

  refreshToken(token: string) {
    if (!token) {
      throw new BadRequestError('No token provided')
    }
    try {
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRETE as string) as JwtPayload
      const accessToken = jwt.sign(
        {
          phone: decoded?.phone || undefined,
          email: decoded?.email || undefined
        },
        process.env.ACCESS_TOKEN_SECRETE as string,
        {
          expiresIn: '30s'
        }
      )
      return { accessToken }
    } catch (err) {
      throw new BadRequestError('Invalid token')
    }
  }

  async getOtp() {
    const otp = await otpModel.find({}).sort({ createdAt: -1 })
    if (!otp) {
      throw new BadRequestError('OTP not found')
    }
    return new OkResponse('Get OTP successfully', otp)
  }

  async forgotPassword(payload: { phone?: string; email?: string }) {
    const { phone, email } = payload

    let findUser

    if (phone && !email) {
      findUser = await userModel.findOne({ phone })
      if (!findUser) throw new BadRequestError('User not found')

      const findCustomer = await customerModel.findOne({ userId: findUser._id })
      if (!findCustomer) throw new BadRequestError('Customer not found')
    } else if (email) {
      findUser = await userModel.findOne({ email })
      if (!findUser) throw new BadRequestError('User not found')

      const findEmployee = await employeeModel.findOne({ userId: findUser._id })
      if (!findEmployee) throw new BadRequestError('Employee not found')
    } else {
      throw new BadRequestError('Phone or Email is required')
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()

    //send email
    if (email) {
      const mailOptions = emailConfig.mailOptions({ email, otpCode })
      const sendMail = await emailConfig.transporter.sendMail(mailOptions)
      if (!sendMail) {
        throw new BadRequestError('Error sending email')
      }
    }

    const otp = await otpModel.create({
      user_id: findUser._id,
      otp_code: otpCode,
      expiration: new Date(Date.now() + 10 * 60 * 1000),
      is_verified: false
    })

    return new OkResponse('Get OTP successfully', otp)
  }

  async verifyOtp({ otp_code, id }: { otp_code: string; id: string }) {
    const user = await userModel.findOne({
      _id: id
    })

    if (!user) {
      throw new BadRequestError('User not found')
    }

    // Tìm OTP theo user_id và otp_code, sắp xếp theo thời gian tạo mới nhất
    const otpRecord = await otpModel
      .findOne({
        user_id: user._id,
        otp_code
      })
      .sort({ created_at: -1 })

    if (!otpRecord) {
      throw new BadRequestError('OTP code is not valid')
    }

    if (otpRecord.expiration < new Date()) {
      throw new BadRequestError('OTP code is expired')
    }

    if (otpRecord.is_verified) {
      throw new BadRequestError('OTP code is already verified')
    }

    otpRecord.is_verified = true
    user.active = true
    await user.save()
    await otpRecord.save()

    return new OkResponse('Verify OTP successfully', otpRecord)
  }

  async resetPassword({ password, id }: { password: string; id: string }) {
    const user = await userModel.findOne({
      _id: id
    })

    if (!user) {
      throw new BadRequestError('User not found')
    }

    // Kiểm tra OTP đã được xác thực hay chưa
    const otp = await otpModel.findOne({
      user_id: user._id,
      is_verified: true,
      expiration: { $gt: new Date() }
    })

    if (!otp) {
      throw new BadRequestError('OTP is not verified or expired')
    }

    //check if password is old password
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (isPasswordMatch) {
      throw new BadRequestError('New password must be different from old password')
    }

    // Cập nhật mật khẩu
    user.password = password
    await user.save()

    // Xoá OTP sau khi đổi mật khẩu (tuỳ ý)
    await otpModel.deleteMany({ user_id: user._id })

    return new OkResponse('Password has been reset successfully')
  }

  async resendOtp(id: string) {
    const user = await userModel.findById(id)
    if (!user) {
      throw new BadRequestError('User not found')
    }
    const checkOtp = await otpModel.updateMany(
      {
        user_id: user._id,
        is_verified: false
      },
      {
        $set: {
          expiration: new Date(Date.now())
        }
      }
    )

    if (!checkOtp) {
      throw new BadRequestError('OTP not found')
    }
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const otp = await otpModel.create({
      user_id: user._id,
      otp_code: otpCode,
      expiration: new Date(Date.now() + 10 * 60 * 1000),
      is_verified: false
    })
    //check user is employee
    if (user.email) {
      const email = user.email
      const mailOptions = emailConfig.mailOptions({ email, otpCode })
      const sendMail = await emailConfig.transporter.sendMail(mailOptions)
      if (!sendMail) {
        throw new BadRequestError('Error sending email')
      }
    }
    return new OkResponse('Resend OTP successfully', otp)
  }
}

const authService = new AuthService()
export default authService
