import { Router } from 'express'
import authRouter from '@/routers/auth.route'
import customerRouter from '@/routers/customer.route'
import employeeRouter from '@/routers/employee.route'
import brandRouter from '@/routers/brand.route'
import categoryRouter from '@/routers/category.route'
import productRouter from '@/routers/product.route'
import verifyJWT from '@/middleware/verifyJWT'
const router = Router()

router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/customer', customerRouter)
router.use('/employee', employeeRouter)
router.use('/brand', brandRouter)
router.use('/category', categoryRouter)
router.use('/product', productRouter)
router.use(verifyJWT)

export default router
