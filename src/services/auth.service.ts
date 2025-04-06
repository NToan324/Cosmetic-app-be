import { BadRequestError } from '@/core/error.response'
import { CreatedResponse, OkResponse } from '@/core/success.response'
import userModel from '@/models/user.model'
import customerModel, { Customer } from '@/models/customer.model'
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
      password
    })

    const newCustomer = (await customerModel.create({
      userId: newUser._id,
      role: 'CUSTOMER',
      rank: 'MEMBER'
    })) as Customer

    const userResponse = {
      id: newUser._id,
      phone: newUser.phone,
      name: newUser.name,
      role: newCustomer.role,
      rank: newCustomer.rank,
      point: newCustomer.point
    }

    return new CreatedResponse('User created successfully', userResponse)
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
