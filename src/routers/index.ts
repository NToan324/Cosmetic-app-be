import { Router } from 'express'
import authRouter from '@/routers/auth.route'
const router = Router()

router.use('/auth', authRouter)

export default router
