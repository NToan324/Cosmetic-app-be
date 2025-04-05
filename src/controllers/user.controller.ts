import userService from '@/services/user.service'
import type { Request, Response } from 'express'

class UserController {
  async deleteUser(req: Request, res: Response) {
    const { id } = req.params
    res.send(await userService.deleteUser(id))
  }

  async getUsers(req: Request, res: Response) {
    res.send(await userService.getUsers())
  }
}
const userController = new UserController()
export default userController
