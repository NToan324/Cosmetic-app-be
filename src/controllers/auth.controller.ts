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

  async getUserByPhoneOrEmail(req: Request, res: Response) {
    const email = req.query.email as string
    const phone = req.query.phone as string
    res.send(await authService.getUserByPhoneOrEmail({ email, phone }))
  }

  async getOtp(req: Request, res: Response) {
    res.send(await authService.getOtp())
  }

  async forgotPassword(req: Request, res: Response) {
    const payload = req.body
    res.send(await authService.forgotPassword(payload))
  }

  async resendOtp(req:Request, res: Response) {
    const { id } = req.body
    res.send(await authService.resendOtp(id))
  }

  async verifyOtp(req: Request, res: Response) {
    const { otp_code } = req.body
    const { id } = req.query as { id: string }
    res.send(await authService.verifyOtp({ otp_code, id }))
  }

  async resetPassword(req: Request, res: Response) {
    const { password } = req.body
    const { id } = req.query as { id: string }
    res.send(await authService.resetPassword({ password, id }))
  }
}
const authController = new AuthController()
export default authController
