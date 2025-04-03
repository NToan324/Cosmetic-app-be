import type { Request, Response } from 'express'
class AuthController {
  async register(req: Request, res: Response) {
    res.status(200).json({
      message: 'User registered successfully'
    })
  }
}
const authController = new AuthController()
export default authController
