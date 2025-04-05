import type { Request, Response } from 'express'
import authService from '@/services/auth.service'
class AuthController {
  async signup(req: Request, res: Response) {
    const { phone, name } = req.body
    res.send(await authService.signup({ phone, name }))
  }
  async login(req: Request, res: Response) {
    const { email, password } = req.body
    res.send(await authService.login({ email, password }))
  }
  async deleteUser(req: Request, res: Response) {
    const { id } = req.params
    res.send(await authService.deleteUser(id))
  }
  async getUser(req: Request, res: Response) {
    const { id } = req.params
    res.send(await authService.getUser(id))
  }
}
const authController = new AuthController()
export default authController
