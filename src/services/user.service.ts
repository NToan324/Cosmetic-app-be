import { OkResponse } from '@/core/success.response'
import userModel from '@/models/user.model'

class UserService {
  async getUsers() {
    const users = await userModel.find()
    return new OkResponse('Get all users successfully', users)
  }
  async deleteUser(id: string) {
    const user = await userModel.findByIdAndDelete(id)
    if (!user) {
      throw new Error('User not found')
    }
    return new OkResponse('User deleted successfully', user)
  }
}
const userService = new UserService()
export default userService
