import userService from '@/services/customer.service'
import type { Request, Response } from 'express'

class UserController {
  async deleteCustomer(req: Request, res: Response) {
    const { id } = req.params
    res.send(await userService.deleteCustomer(id))
  }

  async getCustomers(req: Request, res: Response) {
    res.send(await userService.getCustomers())
  }

  async getCustomer(req: Request, res: Response) {
    const id = req.params.id
    res.send(await userService.getCustomer(id))
  }
}
const userController = new UserController()
export default userController
