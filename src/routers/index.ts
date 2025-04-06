import { Router } from 'express'
import authRouter from '@/routers/auth.route'
import userRouter from '@/routers/user.route'
import productRouter from '@/routers/product.route'
import brandRouter from '@/routers/brand.route'
import categoryRouter from '@/routers/category.route'
import employeeRouter from '@/routers/employee.route'
const router = Router()

router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/product', productRouter)
router.use('/brand', brandRouter)
router.use('/category', categoryRouter)
router.use('/employee', employeeRouter)

export default router
