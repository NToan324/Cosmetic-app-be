import express from 'express'
import customerController from '@/controllers/customer.controller'
import asyncHandler from '@/middleware/asyncHandler'
import { CustomerValidation } from '@/validation/customer.validation'
import { validationRequest } from '@/middleware/validationRequest'
import verifyJWT from '@/middleware/verifyJWT'

const router = express.Router()

router.get('/', verifyJWT, asyncHandler(customerController.getAllCustomers))
router.get('/search', asyncHandler(customerController.searchCustomer))
router.get('/:id', verifyJWT, asyncHandler(customerController.getCustomerById))
router.post(
  '/',
  verifyJWT,
  validationRequest(CustomerValidation.createCustomer()),
  asyncHandler(customerController.createCustomer)
)
router.patch(
  '/:id',
  verifyJWT,
  validationRequest(CustomerValidation.updateCustomer()),
  asyncHandler(customerController.updateCustomer)
)
router.delete('/:id', verifyJWT, asyncHandler(customerController.deleteCustomer))
export default router
