import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import type { Request, Response, NextFunction } from 'express'
import { ForbiddenError, UnauthorizedError } from '@/core/error.response'

dotenv.config()
declare global {
  namespace Express {
    interface Request {
      user?: string | object
    }
  }
}
const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  if (!authHeader) {
    return next(new UnauthorizedError('Unauthorized'))
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    return next(new UnauthorizedError('No token provided'))
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRETE as string, (err: any, decoded: any) => {
    if (err) {
      return next(new ForbiddenError('Invalid token'))
    }

    req.user = decoded

    next()
  })
}

export default verifyJWT
