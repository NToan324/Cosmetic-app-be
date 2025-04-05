import { Router } from 'express'
import authRouter from '@/routers/auth.route'
import userRouter from '@/routers/user.route'
import productRouter from '@/routers/product.route'
const router = Router()

router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/product', userRouter)

export default router
