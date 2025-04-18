import orderController from '@/controllers/order.controller'
import asyncHandler from '@/middleware/asyncHandler'
import verifyJWT from '@/middleware/verifyJWT'
import { Router } from 'express'

const router = Router()

router.get('/', verifyJWT, asyncHandler(orderController.getOrders))
router.get('/search/', verifyJWT, asyncHandler(orderController.searchOrderByFilters))
router.post('/', asyncHandler(orderController.createOrder))
router.patch('/:id', asyncHandler(orderController.updadeOrder))
router.get('/:id', asyncHandler(orderController.getOrderById))
router.delete('/', asyncHandler(orderController.deleteAllOrder))

export default router
