import { Request, Response } from 'express'
import customerService from '@/services/customer.service'

class CustomerController {
  async getAllCustomers(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    res.send(await customerService.getAllCustomers(page, limit))
  }

  async getCustomerById(req: Request, res: Response) {
    const { id } = req.params
    res.send(await customerService.getCustomerById(id))
  }

  async createCustomer(req: Request, res: Response) {
    const { id } = req.user as { id: string }
    const payload = req.body
    res.send(await customerService.createCustomer({ payload, id }))
  }

  async updateCustomer(req: Request, res: Response) {
    const { id } = req.user as { id: string }
    const customerId = req.params.id
    const payload = req.body
    res.send(await customerService.updateCustomer({ payload, id, customerId }))
  }

  async deleteCustomer(req: Request, res: Response) {
    const { id } = req.user as { id: string }
    const customerId = req.params.id
    res.send(await customerService.deleteCustomer({ id, customerId }))
  }

  async searchCustomer(req: Request, res: Response) {
    const { phone } = req.query as { phone: string }
    res.send(await customerService.searchCustomer(phone))
  }
}

const customerController = new CustomerController()
export default customerController
