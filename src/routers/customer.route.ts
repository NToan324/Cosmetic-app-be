import userController from '@/controllers/customer.controller'
import asyncHandler from '@/middleware/asyncHandler'
import { Router } from 'express'
const router = Router()

router.delete('/:id', asyncHandler(userController.deleteCustomer))
router.get('/', asyncHandler(userController.getCustomers))
router.get('/:id', asyncHandler(userController.getCustomer))

export default router
