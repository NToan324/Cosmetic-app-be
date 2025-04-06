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
          as: 'customerDetails'
        }
      },
      {
        $project: {
          password: 0,
          'customerDetails.userId': 0
        }
      }
    ])
    return new OkResponse('Get all users successfully', customers)
  }

  async getCustomer(id: string) {
    const customer = await userModel.aggregate([
      {
        $match: { _id: convertToObjectId(id) }
      },
      {
        $lookup: {
          from: 'customers',
          localField: '_id',
          foreignField: 'userId',
          as: 'customerDetails'
        }
      },
      {
        $project: {
          password: 0,
          'customerDetails.userId': 0
        }
      }
    ])
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
}
const userService = new UserService()
export default userService
