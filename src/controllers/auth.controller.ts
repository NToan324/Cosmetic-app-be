import type { Request, Response } from 'express'
import authService from '@/services/auth.service'

class AuthController {
  async signup(req: Request, res: Response) {
    const { phone, name } = req.body
    res.send(await authService.signup({ phone, name }))
  }

  async login(req: Request, res: Response) {
    const { email, phone, password } = req.body
    const { accessToken, refreshToken, user } = await authService.login({
      email,
      phone,
      password
    })
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    })
    res.send({ message: 'Login successfully', accessToken, user })
  }

  refreshToken(req: Request, res: Response) {
    const { jwt } = req.cookies
    const accessToken = authService.refreshToken(jwt)
    res.send(accessToken)
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params
    res.send(await authService.deleteUser(id))
  }

  async getUser(req: Request, res: Response) {
    const { id } = req.params
    res.send(await authService.getUser(id))
  }

  async getMe(req: Request, res: Response) {
    const { phone, email } = req.user as { phone?: string; email?: string }
    res.send(await authService.getMe({ phone, email }))
  }
}
const authController = new AuthController()
export default authController
