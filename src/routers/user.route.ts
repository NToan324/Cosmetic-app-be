import customerController from '@/controllers/customer.controller'
import asyncHandler from '@/middleware/asyncHandler'
import { Router } from 'express'
const router = Router()

router.delete('/:id', asyncHandler(customerController.deleteCustomer))

export default router
