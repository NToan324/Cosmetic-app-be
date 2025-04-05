import { Router } from 'express'
import authRouter from '@/routers/auth.route'
import userRouter from '@/routers/user.route'
const router = Router()

router.use('/auth', authRouter)
router.use('/user', userRouter)

export default router
