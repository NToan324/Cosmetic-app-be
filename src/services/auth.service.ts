import { BadRequestError } from '@/core/error.response'
import { CreatedResponse, OkResponse } from '@/core/success.response'
import userModel from '@/models/user.model'
import customerModel, { Customer } from '@/models/customer.model'
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'
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
    const userFound = await userModel.findOne({ $or: [{ email }, { phone }] })
    if (!userFound) {
      throw new BadRequestError('User not found')
    }
    const isPasswordMatch = await bcrypt.compare(password, userFound.password)
    if (!isPasswordMatch) {
      throw new BadRequestError('Password is incorrect')
    }
    const accessToken = jwt.sign(
      {
        phone: userFound.phone || undefined,
        email: userFound.email || undefined,
        role: userFound.role
      },
      process.env.ACCESS_TOKEN_SECRETE as string,
      {
        expiresIn: '1h'
      }
    )
    const refreshToken = jwt.sign(
      {
        phone: userFound.phone || undefined,
        email: userFound.email || undefined,
        role: userFound.role
      },
      process.env.REFRESH_TOKEN_SECRETE as string,
      {
        expiresIn: '1d'
      }
    )

    const customer = await customerModel.findOne({ userId: userFound._id })
    let rank
    let point
    if (customer) {
      rank = customer.rank
      point = customer.point
    }

    const user = {
      id: userFound._id,
      phone: userFound.phone,
      name: userFound.name,
      role: userFound.role,
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
}

const authService = new AuthService()
export default authService
