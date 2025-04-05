import { BadRequestError } from '@/core/error.response'
import { CreatedResponse, OkResponse } from '@/core/success.response'
import userModel from '@/models/user.model'
import { ObjectId } from 'mongoose'
class AuthService {
  async signup(payload: { phone: string; name: string }) {
    const { phone, name } = payload
    const isPhoneNumberExist = await userModel.exists({ phone })
    if (isPhoneNumberExist) {
      throw new BadRequestError('Phone number already exists')
    }
    const newUser = await userModel.create({
      phone,
      name
    })
    return new CreatedResponse('User created successfully', newUser)
  }
  async login(data: { email: string; password: string }) {
    return new BadRequestError('Email already exists')
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
}

const authService = new AuthService()
export default authService
