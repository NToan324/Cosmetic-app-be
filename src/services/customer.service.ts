import { OkResponse } from '@/core/success.response'
import userModel from '@/models/user.model'
import customerModel from '@/models/customer.model'
import { convertToObjectId } from '@/helpers/convertObjectId'
import { BadRequestError } from '@/core/error.response'

class UserService {
  async getCustomers() {
    const customers = await userModel.aggregate([
      {
        $lookup: {
          from: 'customers',
          localField: '_id',
          foreignField: 'userId',
          as: 'customer'
        }
      },
      {
        $unwind: '$customer'
      },
      {
        $project: {
          password: 0
        }
      }
    ])
    return new OkResponse('Get all users successfully', customers)
  }

  async getCustomer(id: string) {
    const user = await userModel.findById(id).select('-password')
    if (!user) {
      throw new BadRequestError('User not found')
    }
    const customerDetails = await customerModel.findOne({ userId: user._id })
    if (!customerDetails) {
      throw new BadRequestError('Customer not found')
    }
    const customer = {
      ...user.toObject(),
      customerDetails: {
        ...customerDetails.toObject()
      }
    }
    return new OkResponse('Get user successfully', customer)
  }

  async deleteCustomer(id: string) {
    const isUserExist = await userModel.exists({ _id: convertToObjectId(id) })
    if (!isUserExist) {
      throw new BadRequestError('User not found')
    }
    await Promise.all([userModel.findByIdAndDelete(id), customerModel.findOneAndDelete({ userId: id })])
    return new OkResponse('Delete user successfully', id)
  }

  async searchCustomer(phone: string) {
    const user = await userModel
      .findOne({
        phone: { $regex: phone, $options: 'i' }
      })
      .select('-password')
      .limit(1)
    if (user) {
      console.log('user', user)
      const customer = await customerModel.findOne({
        userId: user._id
      })
      if (!customer) {
        return new OkResponse('Customer not found', [])
      }
      const customerDetails = {
        ...user.toObject(),
        customerDetails: {
          ...customer.toObject()
        }
      }
      return new OkResponse('Get customer successfully', customerDetails)
    }
    return new OkResponse('User not found', [])
  }
}
const userService = new UserService()
export default userService
