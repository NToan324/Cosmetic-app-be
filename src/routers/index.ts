import { Router } from 'express'
import authRouter from '@/routers/auth.route'
import customerRouter from '@/routers/customer.route'
import productRouter from '@/routers/product.route'
import verifyJWT from '@/middleware/verifyJWT'
const router = Router()

router.use('/auth', authRouter)

router.use('/customer', customerRouter)
router.use('/product', productRouter)
router.use(verifyJWT)

export default router
