import userController from '@/controllers/customer.controller'
import asyncHandler from '@/middleware/asyncHandler'
import verifyJWT from '@/middleware/verifyJWT'
import { Router } from 'express'
const router = Router()

router.delete('/:id', asyncHandler(userController.deleteCustomer))
router.get('/', verifyJWT, asyncHandler(userController.getCustomers))
router.get('/search', asyncHandler(userController.searchCustomer))
router.get('/:id', asyncHandler(userController.getCustomer))

export default router
