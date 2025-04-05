
import userController from '@/controllers/user.controller'
import asyncHandler from '@/middleware/asyncHandler'
import { Router } from 'express'
const router = Router()

router.delete('/:id', asyncHandler(userController.deleteUser))
router.get('/', asyncHandler(userController.getUsers))


export default router
