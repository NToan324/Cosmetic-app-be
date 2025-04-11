import userService from '@/services/customer.service'
import type { Request, Response } from 'express'

class UserController {
  async deleteCustomer(req: Request, res: Response) {
    const { id } = req.params
    res.send(await userService.deleteCustomer(id))
  }

  async getCustomers(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    const response = await userService.getCustomers(page, limit)
    res.send(response)
  }

  async getCustomer(req: Request, res: Response) {
    const id = req.params.id
    res.send(await userService.getCustomer(id))
  }

  async searchCustomer(req: Request, res: Response) {
    const { phone } = req.query as { phone: string }
    res.send(await userService.searchCustomer(phone))
  }
}
const userController = new UserController()
export default userController
