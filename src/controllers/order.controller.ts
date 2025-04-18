import { Role } from '@/constants'
import orderService from '@/services/order.servive'
import { type Request, type Response } from 'express'
class OrderController {
  async getOrders(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    // const { id } = req.user as { id: string }
    const user = req.user as {
      id: string
      role: Role[]
    }
    res.send(await orderService.getOrders(user, page, limit))
  }
  async createOrder(req: Request, res: Response) {
    const payload = req.body
    res.send(await orderService.createOrder(payload))
  }

  async getOrderById(req: Request, res: Response) {
    const { id } = req.params
    res.send(await orderService.getOrderById(id))
  }

  async deleteAllOrder(req: Request, res: Response) {
    res.send(await orderService.deleteAllOrder())
  }

  async updadeOrder(req: Request, res: Response) {
    const { id: orderId } = req.params
    const payload = req.body
    res.send(await orderService.updateOrder(payload, orderId))
  }

  async searchOrderByFilters(req: Request, res: Response) {
    const { orderId, customerName, phone, orderedDate } = req.query
    res.send(
      await orderService.searchOrderByFilters({
        orderId: orderId as string,
        customerName: customerName as string,
        phone: phone as string
      })
    )
  }
}

const orderController = new OrderController()
export default orderController
