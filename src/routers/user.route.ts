import customerController from '@/controllers/customer.controller'
import asyncHandler from '@/middleware/asyncHandler'
import { Router } from 'express'
const router = Router()

router.delete('/:id', asyncHandler(customerController.deleteCustomer))
router.get('/', asyncHandler(customerController.getCustomers))

export default router
